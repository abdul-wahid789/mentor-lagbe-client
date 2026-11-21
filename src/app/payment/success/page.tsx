import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentSuccessPage() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4">
            <Card className="w-full border-success/30 bg-card text-center">
                <CardHeader className="items-center space-y-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-tint text-success">
                        <CheckCircle2 className="h-6 w-6" />
                    </span>
                    <CardTitle className="text-xl font-bold">
                        Pro Plan Activated
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Your Stripe payment succeeded and your MentorLagbe account has been
                        upgraded to <strong className="text-foreground">Pro</strong>.
                    </p>
                    <Button
                        size="sm"
                        className="h-9 px-4 text-xs font-semibold"
                        nativeButton={false}

                        render={<Link href="/dashboard">Go to dashboard</Link>}
                    />
                </CardContent>
            </Card>
        </main>
    );
}