import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import {
  getAllTransactionsAdmin,
  getAllTuitionsAdmin,
  getAllUsers,
  type AdminUserRecord,
} from "@/lib/actions/admin";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminOverview } from "@/components/dashboard/AdminOverview";
import type {
  PaymentTransactionRecord,
  TuitionPostItem,
} from "@/types/dashboard";

export default async function AdminDashboardPage() {
  const user = await requireDashboardUser(["admin"]);
  const token = await getServerToken();

  const [usersRes, tuitionsRes, transactionsRes] = await Promise.all([
    getAllUsers(token),
    getAllTuitionsAdmin(token),
    getAllTransactionsAdmin(token),
  ]);

  const users: AdminUserRecord[] =
    !usersRes.error && Array.isArray(usersRes.data) ? usersRes.data : [];

  const tuitions: TuitionPostItem[] =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  const transactions: PaymentTransactionRecord[] =
    !transactionsRes.error && Array.isArray(transactionsRes.data)
      ? transactionsRes.data
      : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Overview">
      <AdminOverview
        user={user}
        users={users}
        tuitions={tuitions}
        transactions={transactions}
      />
    </DashboardShell>
  );
}