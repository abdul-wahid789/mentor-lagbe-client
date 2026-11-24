import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyApplications } from "@/lib/actions/application";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { StudentApplicationsClient } from "@/components/dashboard/student/StudentApplicationsClient";
import type { StudentApplicationItem } from "@/types/dashboard";

export default async function StudentApplicationsPage() {
  const user = await requireDashboardUser(["student"]);
  const token = await getServerToken();

  const res = await getMyApplications(token);
  const initialApplications: StudentApplicationItem[] = res.error
    ? []
    : Array.isArray(res.data)
      ? res.data
      : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="My applications">
      <StudentApplicationsClient initialApplications={initialApplications} />
    </DashboardShell>
  );
}