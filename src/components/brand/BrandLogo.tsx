import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  size?: number;
  className?: string;
  textClassName?: string;
}

export function BrandLogo({
  href = "/",
  size = 28,
  className,
  textClassName,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 shrink-0 group", className)}
    >
      <Image
        src="/logo.png"
        alt="MentorLagbe logo"
        width={size}
        height={size}
        priority
        className="rounded-md object-contain"
      />
      <span
        className={cn(
          "text-base font-bold tracking-tight text-foreground",
          textClassName
        )}
      >
        MentorLagbe
      </span>
    </Link>
  );
}