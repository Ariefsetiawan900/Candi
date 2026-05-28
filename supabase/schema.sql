-- CANDI — database schema
-- Run this once in the Supabase SQL editor (Project → SQL → New query)

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin','member')) default 'member',
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- TABLE: orders
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  customer_name text not null,
  menu text not null,
  package text not null,
  order_date date not null,
  pickup_date date not null,
  quantity int not null check (quantity > 0),
  status text not null check (status in ('pending','processing','ready','completed','cancelled')) default 'pending',
  note text,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- ============================================================================
-- FUNCTION + TRIGGER: auto-generate order_no like ORD-YYYYMMDD-NNN
-- ============================================================================
create or replace function public.set_order_no()
returns trigger language plpgsql as $$
declare
  prefix text := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-';
  next_seq int;
begin
  if new.order_no is null then
    select coalesce(max(substring(order_no from '\d+$')::int), 0) + 1
      into next_seq
      from public.orders
      where order_no like prefix || '%';
    new.order_no := prefix || lpad(next_seq::text, 3, '0');
  end if;
  return new;
end $$;

drop trigger if exists orders_set_order_no on public.orders;
create trigger orders_set_order_no
  before insert on public.orders
  for each row execute function public.set_order_no();

-- ============================================================================
-- FUNCTION + TRIGGER: auto-create profile when a new auth user is created.
-- /register page sets metadata.role='admin'; admin-created members get 'member'.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role, is_active, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'admin'),
    true,
    now()
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.orders   enable row level security;

-- profiles: users can read their own row
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id);

-- profiles: admins can read all rows
drop policy if exists profiles_admin_read on public.profiles;
create policy profiles_admin_read on public.profiles
  for select using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- profiles: users can update their own row (e.g. change name)
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id);

-- profiles: admins can update any profile (e.g. toggle is_active)
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- orders: any authenticated user can read
drop policy if exists orders_authed_read on public.orders;
create policy orders_authed_read on public.orders
  for select using (auth.role() = 'authenticated');

-- orders: only admins can insert/update/delete
drop policy if exists orders_admin_write on public.orders;
create policy orders_admin_write on public.orders
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )) with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  ));
