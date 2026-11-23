import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const role = (session.user as Record<string, unknown>).role;

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  }
  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/student");
}