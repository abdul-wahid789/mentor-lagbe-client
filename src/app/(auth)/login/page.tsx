import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SigninPromoPanel } from "@/components/auth/SigninPromoPanel";
import { SigninFormCard } from "@/components/auth/SigninFormCard";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <SigninPromoPanel />
            </div>
            <div className="mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none">
              <Suspense
                fallback={
                  <div className="h-[460px] rounded-xl border border-border bg-card p-6 animate-pulse" />
                }
              >
                <SigninFormCard />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}