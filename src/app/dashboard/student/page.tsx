import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyApplications } from "@/lib/actions/application";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { StudentOverview } from "@/components/dashboard/student/StudentOverview";
import type { StudentApplicationItem } from "@/types/dashboard";

export default async function StudentDashboardPage() {
  const user = await requireDashboardUser(["student"]);
  const token = await getServerToken();

  const applicationsRes = await getMyApplications(token);
  const INITIAL_APPLICATIONS: StudentApplicationItem[] = applicationsRes.error
    ? []
    : Array.isArray(applicationsRes.data)
      ? applicationsRes.data
      : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Overview">
      <StudentOverview user={user} applications={INITIAL_APPLICATIONS} />
    </DashboardShell>
  );
}