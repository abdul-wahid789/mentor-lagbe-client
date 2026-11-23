export type PaymentRole = "student" | "tutor" | "admin";

export type PaymentPlanSlug = "pro-student" | "pro-tutor";

export type PaymentPlanName = "Pro Student" | "Pro Tutor";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface PaymentDocument {
  _id?: string;
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: PaymentRole;
  plan: PaymentPlanSlug | string;
  planName: PaymentPlanName | string;
  amount: number;
  currency: string;
  transactionId: string;
  status?: PaymentStatus | string;
  paidAt: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  paidAt?: unknown;
  createdAt?: unknown;
}