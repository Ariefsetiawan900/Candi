import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { MembersTable } from "@/features/members/members-table";
import { AddMemberDialog } from "@/features/members/add-member-dialog";

export const metadata = { title: "Members — CANDI" };

export default async function MembersPage() {
  await requireRole("admin");

  const admin = createAdminClient();

  const { data: profiles = [] } = await admin
    .from("profiles")
    .select("id, name, role, created_at")
    .eq("role", "member")
    .order("created_at", { ascending: false });

  // Hydrate emails from auth.users via the admin API.
  const members = await Promise.all(
    (profiles ?? []).map(async (p) => {
      const { data } = await admin.auth.admin.getUserById(p.id);
      return { ...p, email: data?.user?.email ?? "" };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground">
            Add, manage, and reset passwords for member accounts.
          </p>
        </div>
        <AddMemberDialog />
      </div>

      <MembersTable members={members} />
    </div>
  );
}
