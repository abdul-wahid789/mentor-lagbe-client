import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4">
      <Card className="w-full border-destructive/30 bg-card text-center">
        <CardHeader className="items-center space-y-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive-tint text-destructive">
            <XCircle className="h-6 w-6" />
          </span>
          <CardTitle className="text-xl font-bold">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            No charges were made. You can upgrade to Pro anytime from your
            dashboard or pricing section.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs font-semibold"
            nativeButton={false}
            render={<Link href="/dashboard">Back to dashboard</Link>}
          />
        </CardContent>
      </Card>
    </main>
  );
}