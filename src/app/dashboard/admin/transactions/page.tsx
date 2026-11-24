import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getAllTransactionsAdmin } from "@/lib/actions/admin";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { AdminTransactionsClient } from "@/components/dashboard/admin/AdminTransactionsClient";
import type { PaymentTransactionRecord } from "@/types/dashboard";

export default async function AdminTransactionsPage() {
  const user = await requireDashboardUser(["admin"]);
  const token = await getServerToken();

  const txRes = await getAllTransactionsAdmin(token);
  const initialTransactions: PaymentTransactionRecord[] =
    !txRes.error && Array.isArray(txRes.data) ? txRes.data : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Transactions">
      <AdminTransactionsClient initialTransactions={initialTransactions} />
    </DashboardShell>
  );
}