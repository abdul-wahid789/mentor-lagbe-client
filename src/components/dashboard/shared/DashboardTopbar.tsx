"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserCog,
} from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { showSuccessToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      showSuccessToast("Signed out successfully.");
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

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
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">{breadcrumbLabel}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5">
        <Link
          href="/"
          className="hidden items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline sm:inline-flex"
        >
          <span>Back to website</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="h-8 w-8 rounded-full border-border bg-card text-foreground hover:bg-secondary/60"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-primary" />
          ) : (
            <Moon className="h-4 w-4 text-primary" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open profile menu"
            className="group/trigger flex cursor-pointer items-center gap-2 rounded-full border border-transparent py-1 pl-1 pr-1.5 transition-colors hover:border-border/70 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:pr-2.5"
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
              <p className="max-w-32 truncate text-xs font-semibold text-foreground">
                {user.name}
              </p>
              <p className="text-[11px] capitalize text-muted-foreground">
                {user.role}
              </p>
            </div>

            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 group-data-popup-open/trigger:rotate-180 md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 rounded-xl border border-border/80 bg-popover p-1.5 shadow-lg"
          >
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-xs font-bold text-primary">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <span>{initials || "ML"}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold capitalize text-primary">
                {user.role}
              </span>
            </div>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium sm:text-sm"
            >
              <UserCog className="h-4 w-4 text-primary" />
              <span>Update profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/")}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium sm:hidden"
            >
              <ArrowUpRight className="h-4 w-4 text-primary" />
              <span>Back to website</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              variant="destructive"
              disabled={signingOut}
              onClick={handleSignOut}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>{signingOut ? "Signing out..." : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
