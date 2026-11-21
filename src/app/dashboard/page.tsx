import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-session";

export default async function DashboardIndexPage() {
  const user = await requireDashboardUser();
  redirect(`/dashboard/${user.role}`);
}