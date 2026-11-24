import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyTuitions } from "@/lib/actions/tuition";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import { PostTuitionForm } from "@/components/dashboard/tutor/PostTuitionForm";

export default async function PostTuitionPage() {
  const user = await requireDashboardUser(["tutor"]);
  const token = await getServerToken();
  const tuitionsRes = await getMyTuitions(token);

  const existingTuitionsCount =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data.length
      : 0;

  return (
    <DashboardShell user={user} breadcrumbLabel="Post tuition">
      <PostTuitionForm
        user={user}
        existingTuitionsCount={existingTuitionsCount}
      />
    </DashboardShell>
  );
}