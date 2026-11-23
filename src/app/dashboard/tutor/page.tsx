import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyTuitions } from "@/lib/actions/tuition";
import { getTutorApplicants } from "@/lib/actions/application";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TutorOverview } from "@/components/dashboard/TutorOverview";
import type { StudentApplicationItem, TuitionPostItem } from "@/types/dashboard";

export default async function TutorDashboardPage() {
  const user = await requireDashboardUser(["tutor"]);
  const token = await getServerToken();

  const [tuitionsRes, applicantsRes] = await Promise.all([
    getMyTuitions(token),
    getTutorApplicants(token),
  ]);
  console.log(applicantsRes)
  const INITIAL_TUITIONS: TuitionPostItem[] = tuitionsRes.error
    ? []
    : Array.isArray(tuitionsRes.data)
    ? tuitionsRes.data
    : [];

  const INITIAL_APPLICANTS: StudentApplicationItem[] = applicantsRes.error
    ? []
    : Array.isArray(applicantsRes.data)
    ? applicantsRes.data
    : [];

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