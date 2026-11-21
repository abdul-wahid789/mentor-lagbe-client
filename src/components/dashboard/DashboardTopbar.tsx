"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { DashboardUser } from "@/types/dashboard";

interface DashboardTopbarProps {
  user: DashboardUser;
  breadcrumbLabel?: string;
}

export function DashboardTopbar({
  user,
  breadcrumbLabel = "Overview",
}: DashboardTopbarProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-8 w-8 text-foreground" />
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"
        >
          <Link
            href={`/dashboard/${user.role}`}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">{breadcrumbLabel}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hidden items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4 sm:inline-flex"
        >
          <span>Back to website</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-secondary/60"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-xs font-bold text-primary">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <span>{initials || "ML"}</span>
            )}
          </div>
          <div className="hidden text-left leading-tight md:block">
            <p className="text-xs font-semibold text-foreground">{user.name}</p>
            <p className="text-[11px] capitalize text-muted-foreground">
              {user.role}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}