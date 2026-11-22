import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  CheckoutCard,
  type CheckoutPlanKey,
} from "@/components/payment/CheckoutCard";

export default async function PaymentCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const selectedPlan: CheckoutPlanKey =
    plan === "pro-student" ? "pro-student" : "pro-tutor";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
        <CheckoutCard plan={selectedPlan} />
      </main>
      <Footer />
    </div>
  );
}