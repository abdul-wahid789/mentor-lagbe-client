import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TutorOverview } from "@/components/dashboard/TutorOverview";
import type { StudentApplicationItem, TuitionPostItem } from "@/types/dashboard";
import { getMyTuitions } from "@/lib/actions/tuition";
import { getServerToken } from "@/lib/server-token";

// Replace with live data fetched from your Express / MongoDB Atlas API
// const { data, error, msg } = await getMyTuitions()
// console.log(data, error, msg, "tution")
// const INITIAL_TUITIONS: TuitionPostItem[] = error ? [] : data ? data : [];
// const INITIAL_APPLICANTS: StudentApplicationItem[] = [];

export default async function TutorDashboardPage() {
  const user = await requireDashboardUser(["tutor"]);

  const token = await getServerToken()
  const { data, error, msg } = await getMyTuitions(token)
  console.log(data, error, msg, "tution")
  const INITIAL_TUITIONS: TuitionPostItem[] = error ? [] : data ? data : [];
  const INITIAL_APPLICANTS: StudentApplicationItem[] = [];

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