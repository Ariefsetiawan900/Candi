import { createClient } from "@/lib/supabase/server";
import { StatCards } from "@/features/orders/stat-cards";
import { OrdersPage } from "@/features/orders/orders-page";
import {
  ACTIVE_STATUSES,
  HISTORY_STATUSES,
} from "@/lib/constants/order-status";
import { todayISO } from "@/lib/utils/format-date";

export const metadata = { title: "Dashboard — CANDI" };

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: orders = [] }, activeCountRes, completedCountRes, todayCountRes] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, order_no, customer_name, menu, package, order_date, pickup_date, quantity, status, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("status", ACTIVE_STATUSES),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${todayISO()}T00:00:00Z`),
    ]);

  const all = orders ?? [];
  const activeOrders = all.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const historyOrders = all.filter((o) => HISTORY_STATUSES.includes(o.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage orders at a glance.
        </p>
      </div>

      <StatCards
        active={activeCountRes.count ?? 0}
        completed={completedCountRes.count ?? 0}
        today={todayCountRes.count ?? 0}
      />

      <OrdersPage activeOrders={activeOrders} historyOrders={historyOrders} />
    </div>
  );
}
