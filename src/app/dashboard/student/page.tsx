import { requireDashboardUser } from "@/lib/dashboard-session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StudentOverview } from "@/components/dashboard/StudentOverview";
import type { StudentApplicationItem } from "@/types/dashboard";

// Replace with live data fetched from your Express / MongoDB Atlas API
const INITIAL_APPLICATIONS: StudentApplicationItem[] = [
  {
    id: "app-1",
    tuitionId: "math-1",
    tuitionTitle: "Mathematics, made simple",
    tutorName: "Rafiq Ahmed",
    tutorEmail: "rafiq@example.com",
    studentName: "Samia Ahmed",
    studentEmail: "samia@example.com",
    studentPhone: "+8801700000001",
    preferredSchedule: "Sat / Mon / Wed · 5:00 PM",
    note: "Need help with quadratic equations and trigonometry.",
    monthlyFee: 2500,
    appliedAt: "18 Nov 2026",
    status: "pending",
  },
  {
    id: "app-2",
    tuitionId: "physics-1",
    tuitionTitle: "Build your physics foundation",
    tutorName: "Nadia Islam",
    tutorEmail: "nadia@example.com",
    studentName: "Samia Ahmed",
    studentEmail: "samia@example.com",
    studentPhone: "+8801700000001",
    preferredSchedule: "Sun / Tue / Thu · 4:00 PM",
    note: "Looking for concept clarity and weekly problem sets.",
    monthlyFee: 4000,
    appliedAt: "16 Nov 2026",
    status: "accepted",
  },
];

export default async function StudentDashboardPage() {
  const user = await requireDashboardUser(["student"]);

  return (
    <DashboardShell user={user} breadcrumbLabel="Overview">
      <StudentOverview user={user} applications={INITIAL_APPLICATIONS} />
    </DashboardShell>
  );
}