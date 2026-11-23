import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyApplications } from "@/lib/actions/application";
import { getTuitionFeedbacks } from "@/lib/actions/feedback";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StudentFeedbackClient } from "@/components/dashboard/StudentFeedbackClient";
import type {
  StudentApplicationItem,
  TuitionFeedbackItem,
} from "@/types/dashboard";

export default async function StudentFeedbackPage() {
  const user = await requireDashboardUser(["student"]);
  const token = await getServerToken();

  const appsRes = await getMyApplications(token);
  const applications: StudentApplicationItem[] =
    !appsRes.error && Array.isArray(appsRes.data) ? appsRes.data : [];

  // Only tuitions where the student applied and were approved ("accepted")
  const approvedTuitions = Array.from(
    new Map(
      applications
        .filter((app) => app.status === "accepted" && app.tuitionId)
        .map((app) => [String(app.tuitionId), app])
    ).values()
  );

  const feedbackEntries = await Promise.all(
    approvedTuitions.map(async (item) => {
      const id = String(item.tuitionId);
      const res = await getTuitionFeedbacks(id, token);
      const list: TuitionFeedbackItem[] =
        !res.error && Array.isArray(res.data) ? res.data : [];
      return [id, list] as const;
    })
  );

  const initialFeedbacksByTuition = Object.fromEntries(feedbackEntries);

  return (
    <DashboardShell user={user} breadcrumbLabel="Feedback">
      <StudentFeedbackClient
        user={user}
        approvedTuitions={approvedTuitions}
        initialFeedbacksByTuition={initialFeedbacksByTuition}
      />
    </DashboardShell>
  );
}