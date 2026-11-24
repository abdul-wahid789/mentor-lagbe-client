import type { NavItem, UserRole } from "@/types/dashboard";

export function getRoleWorkspaceLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "ADMIN WORKSPACE";
    case "tutor":
      return "TUTOR WORKSPACE";
    default:
      return "STUDENT WORKSPACE";
  }
}

export function getRoleNavItems(role: UserRole): NavItem[] {
  if (role === "student") {
    return [
      { label: "Overview", href: "/dashboard/student", icon: "home" },
      {
        label: "My applications",
        href: "/dashboard/student/applications",
        icon: "list",
      },
      {
        label: "Browse tuitions",
        href: "/dashboard/student/tuitions",
        icon: "search",
      },
      {
        label: "Bookmarks",
        href: "/dashboard/student/bookmarks",
        icon: "bookmark",
      },
      {
        label: "Feedback",
        href: "/dashboard/student/feedback",
        icon: "messageSquare",
      },
    ];
  }

  if (role === "tutor") {
    return [
      { label: "Overview", href: "/dashboard/tutor", icon: "home" },
      {
        label: "Post tuition",
        href: "/dashboard/tutor/post-tuition",
        icon: "plus",
      },
      {
        label: "My tuitions",
        href: "/dashboard/tutor/my-tuitions",
        icon: "list",
      },
      {
        label: "Applicants",
        href: "/dashboard/tutor/applicants",
        icon: "users",
      },
    ];
  }

  return [
    { label: "Overview", href: "/dashboard/admin", icon: "home" },
    { label: "Users", href: "/dashboard/admin/users", icon: "users" },
    {
      label: "Tuition approvals",
      href: "/dashboard/admin/tuitions",
      icon: "checkSquare",
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: "creditCard",
    },
  ];
}