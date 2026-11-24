import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyTuitions } from "@/lib/actions/tuition";
import { getTutorApplicants } from "@/lib/actions/application";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { TutorApplicantsClient } from "@/components/dashboard/tutor/TutorApplicantsClient";
import type { StudentApplicationItem, TuitionPostItem } from "@/types/dashboard";

export default async function TutorApplicantsPage() {
  const user = await requireDashboardUser(["tutor"]);
  const token = await getServerToken();

  const [applicantsRes, tuitionsRes] = await Promise.all([
    getTutorApplicants(token),
    getMyTuitions(token),
  ]);

  const initialApplicants: StudentApplicationItem[] = applicantsRes.error
    ? []
    : Array.isArray(applicantsRes.data)
      ? applicantsRes.data
      : [];

  const tuitions: TuitionPostItem[] = tuitionsRes.error
    ? []
    : Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  return (
    <DashboardShell user={user} breadcrumbLabel="Applicants">
      <TutorApplicantsClient
        initialApplicants={initialApplicants}
        tuitions={tuitions}
      />
    </DashboardShell>
  );
}