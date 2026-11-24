import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getAllUsers, type AdminUserRecord } from "@/lib/actions/admin";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { AdminUsersClient } from "@/components/dashboard/admin/AdminUsersClient";

export default async function AdminUsersPage() {
  const user = await requireDashboardUser(["admin"]);
  const token = await getServerToken();

  const usersRes = await getAllUsers(token);
  const initialUsers: AdminUserRecord[] =
    !usersRes.error && Array.isArray(usersRes.data) ? usersRes.data : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Users">
      <AdminUsersClient initialUsers={initialUsers} />
    </DashboardShell>
  );
}