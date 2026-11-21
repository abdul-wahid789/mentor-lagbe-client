import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PostTuitionForm } from "@/components/dashboard/PostTuitionForm";

export default async function PostTuitionPage() {
  const user = await requireDashboardUser(["tutor"]);

  // Replace with live count from your Express / MongoDB Atlas backend
  const existingTuitionsCount = 0;

  return (
    <DashboardShell user={user} breadcrumbLabel="Post tuition">
      <PostTuitionForm
        user={user}
        existingTuitionsCount={existingTuitionsCount}
      />
    </DashboardShell>
  );
}