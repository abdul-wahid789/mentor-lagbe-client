"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { showSuccessToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const displayName = user?.name?.trim() || "User";
  const firstLetter = displayName.charAt(0).toUpperCase() || "U";
  const userImage =
    typeof user?.image === "string" && user.image.trim() ? user.image : null;

  const handleSignOut = async () => {
    await authClient.signOut();
    setMobileOpen(false);
    showSuccessToast("Signed out successfully.");
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo size={26} />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme Toggle + Auth / User Dropdown */}
        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggleButton />

          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card py-1 pl-1 pr-2.5 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={displayName}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                      >
                        {firstLetter}
                      </span>
                    )}
                    <span className="max-w-32 truncate text-xs font-semibold text-foreground">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                }
              />

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="space-y-0.5">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {displayName}
                    </p>
                    {user.email && (
                      <p className="truncate text-[11px] font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive afocus:bg-destructive-tint afocus:text-destructive hover:bg-destructive-tint!"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login">Sign in</Link>}
              />
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/register">Get started</Link>}
              />
            </>
          )}
        </div>

        {/* Mobile Theme Toggle + Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton />

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="h-9 w-9 border-border bg-card text-foreground"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          {user && (
            <div className="mb-3 space-y-2.5 rounded-xl border border-border/80 bg-secondary/40 p-3">
              <div className="flex items-center gap-2.5">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={displayName}
                    width={34}
                    height={34}
                    className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                  >
                    {firstLetter}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {displayName}
                  </p>
                  {user.email && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs font-medium text-primary"
                  nativeButton={false}
                  render={
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium text-foreground"
                  nativeButton={false}
                  render={
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="mr-1.5 h-3.5 w-3.5" />
                      <span>Profile</span>
                    </Link>
                  }
                />
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-3 text-sm font-medium">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
            {user ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full border-destructive/25 bg-destructive-tint/50 text-destructive hover:bg-destructive-tint"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                <span>Sign out</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  }
                />
                <Button
                  size="sm"
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Get started
                    </Link>
                  }
                />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}