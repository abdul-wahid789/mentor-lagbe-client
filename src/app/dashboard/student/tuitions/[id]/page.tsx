import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TuitionDetailsClient } from "@/components/tuitions/TuitionDetailsClient";

interface DashboardTuitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardTuitionDetailPage({
  params,
}: DashboardTuitionDetailPageProps) {
  const user = await requireDashboardUser(["student"]);
  const { id } = await params;

  return (
    <DashboardShell user={user} breadcrumbLabel="Tuition details">
      <TuitionDetailsClient
        tuitionId={id}
        backHref="/dashboard/student/tuitions"
        backLabel="Back to browse tuitions"
      />
    </DashboardShell>
  );
}