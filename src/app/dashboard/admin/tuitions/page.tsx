import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getAllTuitionsAdmin } from "@/lib/actions/admin";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminTuitionApprovalsClient } from "@/components/dashboard/AdminTuitionApprovalsClient";
import type { TuitionPostItem } from "@/types/dashboard";

export default async function AdminTuitionApprovalsPage() {
  const user = await requireDashboardUser(["admin"]);
  const token = await getServerToken();

  const tuitionsRes = await getAllTuitionsAdmin(token);
  const initialTuitions: TuitionPostItem[] =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Tuition approvals">
      <AdminTuitionApprovalsClient initialTuitions={initialTuitions} />
    </DashboardShell>
  );
}