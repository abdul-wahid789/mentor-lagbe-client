import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RoleSelectionClient } from "@/components/auth/RoleSelectionClient";

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userObj = session.user as Record<string, unknown>;
  const role = typeof userObj.role === "string" ? userObj.role.trim() : "";

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  }
  if (role === "admin") {
    redirect("/dashboard/admin");
  }
  if (role === "student") {
    redirect("/dashboard/student");
  }

  return (
    <RoleSelectionClient
      userName={typeof userObj.name === "string" ? userObj.name : undefined}
      userEmail={typeof userObj.email === "string" ? userObj.email : undefined}
    />
  );
}