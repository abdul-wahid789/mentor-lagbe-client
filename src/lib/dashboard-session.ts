import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { DashboardUser, SubscriptionPlan, UserRole } from "@/types/dashboard";

function normalizeRole(rawRole: unknown): UserRole {
  if (rawRole === "admin" || rawRole === "tutor" || rawRole === "student") {
    return rawRole;
  }
  return "student";
}

function normalizePlan(rawPlan: unknown): SubscriptionPlan {
  return rawPlan === "pro" ? "pro" : "free";
}

export async function getOptionalDashboardUser(): Promise<DashboardUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
      query: {
        disableCookieCache: true,
      },
    });

    if (!session?.user) {
      return null;
    }

    const rawUser = session.user as Record<string, unknown>;
    console.log(session.user)

    return {
      id: String(rawUser.id),
      name: String(rawUser.name || "User"),
      email: String(rawUser.email || ""),
      image: typeof rawUser.image === "string" ? rawUser.image : null,
      role: normalizeRole(rawUser.role),
      plan: normalizePlan(rawUser.plan),
      phone: typeof rawUser.phone === "string" ? rawUser.phone : "",
      bio: typeof rawUser.bio === "string" ? rawUser.bio : "",
    };
  } catch {
    return null;
  }
}

export async function requireDashboardUser(
  allowedRoles?: UserRole[]
): Promise<DashboardUser> {
  const user = await getOptionalDashboardUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect(`/dashboard/${user.role}`);
  }
  return user;
}