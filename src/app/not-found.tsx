import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-16 text-center sm:px-10 sm:py-24 lg:px-16">
        <div className="flex max-w-xl flex-col items-center space-y-6">
          <div className="space-y-3">
            <p className="text-6xl font-bold leading-none tracking-tight text-primary sm:text-7xl">
              404
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A little off the learning path.
            </h1>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            We couldn’t find this page. It may have moved, or the link might be
            out of date. Your next chapter is still waiting.
          </p>

          <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              nativeButton={false}
              className="h-11 rounded-lg px-5 text-sm font-semibold"
              render={
                <Link href="/">
                  <span>Back to Home</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              }
            />

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-11 rounded-lg border-border bg-card px-5 text-sm font-semibold text-primary hover:bg-secondary/60"
              render={<Link href="/tuitions">Browse tuitions</Link>}
            />
          </div>

          <p className="pt-2 text-xs text-muted-foreground sm:text-sm">
            Need a hand?{" "}
            <a
              href="mailto:abdulwahid.contact@gmail.com"
              className="font-medium underline-offset-4 hover:text-foreground hover:underline"
            >
              abdulwahid.contact@gmail.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}