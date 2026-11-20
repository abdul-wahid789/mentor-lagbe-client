import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand/BrandLogo";
import LoginImg from "@/assets/images/login-cover.png"


export function SigninPromoPanel() {
  return (
    <Card className="hidden overflow-hidden border-primary/20 bg-secondary/65 p-7 shadow-xs lg:flex lg:flex-col lg:justify-between">
      <CardContent className="flex h-full flex-col justify-between space-y-6 p-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Your next chapter starts here
            </p>
            <Badge
              variant="outline"
              className="rounded-full border-accent/30 bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent"
            >
              <ShieldCheck className="mr-1 h-3 w-3" />
              Role-aware workspace
            </Badge>
          </div>

          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground xl:text-[2.15rem]">
            The right guidance changes everything.
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Sign in once and land right where you belong—whether managing
            tuition batches, tracking applications, or moderating listings.
          </p>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-card">
          <Image
            src={LoginImg}
            alt="Tutor and student reviewing notes together"
            fill
            sizes="(max-width: 1280px) 45vw, 520px"
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/90 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Join a community that believes in your potential.
          </p>
          <BrandLogo size={20} textClassName="text-xs font-semibold" />
        </div>
      </CardContent>
    </Card>
  );
}