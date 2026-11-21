export type UserRole = "student" | "tutor" | "admin";
export type SubscriptionPlan = "free" | "pro";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type TuitionMode = "Online" | "Home";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  plan: SubscriptionPlan;
  phone?: string;
  bio?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: "home" | "plus" | "list" | "users" | "checkSquare" | "creditCard" | "search" | "user" | "logout";
  external?: boolean;
}

export interface StatMetric {
  label: string;
  value: string | number;
  subtext: string;
  href?: string;
}

export interface TuitionPostItem {
  _id?: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  bannerUrl?: string;
  tutorId?: string;
  tutorName?: string;
  tutorEmail?: string;
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
  applicantsCount?: number;
  createdAt?: string;
}

export interface StudentApplicationItem {
  id: string;
  tuitionId: string;
  tuitionTitle: string;
  tutorName: string;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  note: string;
  monthlyFee: number;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  joinedAt: string;
}

export interface PaymentTransactionRecord {
  id: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  planName: "Pro Student" | "Pro Tutor";
  amount: number;
  currency: string;
  transactionId: string;
  paidAt: string;
}