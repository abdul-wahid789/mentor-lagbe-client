import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const retryHref =
    plan === "pro-student"
      ? "/payment/checkout?plan=pro-student"
      : "/payment/checkout?plan=pro-tutor";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-xl border-border bg-card shadow-xs">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-warning">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>No payment taken</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl">
                No rush. Your journey is still here.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your checkout was cancelled. Your account stays on the Free plan,
                and you haven&apos;t been charged.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="sm"
                nativeButton={false}
                className="h-9 px-4 text-xs font-semibold sm:text-sm"
                render={<Link href={retryHref}>Try checkout again</Link>}
              />
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                className="h-9 border-primary/25 px-4 text-xs font-semibold text-primary sm:text-sm"
                render={<Link href="/#pricing">Back to pricing</Link>}
              />
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}