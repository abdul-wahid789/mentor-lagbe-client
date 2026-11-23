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
  icon: "home" | "plus" | "list" | "users" | "checkSquare" | "creditCard" | "search" | "user" | "logout" | "messageSquare";
  external?: boolean;
}

export interface StatMetric {
  label: string;
  value: string | number;
  subtext: string;
  href?: string;
}

export type PaymentRole = "student" | "tutor" | "admin";
export type PaymentPlanSlug = "pro-student" | "pro-tutor";
export type PaymentPlanName = "Pro Student" | "Pro Tutor";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface PaymentTransactionRecord {
  id: string;
  _id?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  role: PaymentRole | string;
  plan?: PaymentPlanSlug | string;
  planName: PaymentPlanName | string;
  amount: number;
  currency: string;
  transactionId: string;
  status?: PaymentStatus | string;
  paidAt: string;
  createdAt?: string;
}


export interface TuitionFeedbackItem {
  id: string;
  _id?: string;
  tuitionId: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
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
  rejectionNote?: string;
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