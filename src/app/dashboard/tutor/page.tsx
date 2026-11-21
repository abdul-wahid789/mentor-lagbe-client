import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TutorOverview } from "@/components/dashboard/TutorOverview";
import type { StudentApplicationItem, TuitionPostItem } from "@/types/dashboard";

// Replace with live data fetched from your Express / MongoDB Atlas API
const INITIAL_TUITIONS: TuitionPostItem[] = [];
const INITIAL_APPLICANTS: StudentApplicationItem[] = [];

export default async function TutorDashboardPage() {
  const user = await requireDashboardUser(["tutor"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="Overview">
      <TutorOverview
        user={user}
        tuitions={INITIAL_TUITIONS}
        applicants={INITIAL_APPLICANTS}
      />
    </DashboardShell>
  );
}