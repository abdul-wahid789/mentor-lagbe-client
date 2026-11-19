import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { TuitionListing } from "@/types/home";
import { cn } from "@/lib/utils";

interface TuitionCardProps {
    listing: TuitionListing;
}

export function TuitionCard({ listing }: TuitionCardProps) {
    const isOnline = listing.mode === "Online";

    return (
        <Card className="flex flex-col justify-between border-border bg-card transition-colors hover:border-primary/40">
            <div>
                <CardHeader className="pb-2.5">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="rounded-md px-2 py-0.5 text-[11px] font-medium bg-secondary text-secondary-foreground"
                        >
                            {listing.subject}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={cn(
                                "rounded-md px-2 py-0.5 text-[11px] font-medium border",
                                isOnline
                                    ? "bg-accent-tint text-accent border-accent/25"
                                    : "bg-success-tint text-success border-success/25"
                            )}
                        >
                            {listing.mode}
                        </Badge>
                    </div>

                    <h3 className="pt-2 text-base font-semibold leading-snug text-foreground">
                        {listing.title}
                    </h3>
                </CardHeader>

                <CardContent className="space-y-1.5 pb-4 text-xs text-muted-foreground">
                    <p className="font-mono text-[11px] text-muted-foreground">
                        {listing.level} · {listing.schedule}
                    </p>
                    <p className="text-foreground/85">
                        {listing.tutorName}
                        {listing.verified && (
                            <span className="text-muted-foreground"> · Verified tutor</span>
                        )}
                    </p>
                </CardContent>
            </div>

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-3.5">
                <div className="text-sm font-semibold text-foreground tabular-nums">
                    <span className="font-mono">{listing.monthlyRate}</span>
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / month
                    </span>
                </div>
                <Link href={listing.href}>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-3 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"

                    >View details
                    </Button></Link>

            </CardFooter>
        </Card>
    );
}