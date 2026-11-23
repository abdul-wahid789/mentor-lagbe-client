"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Home,
  ListChecks,
  LogOut,
  MessageSquarePlus,
  Plus,
  Search,
  UserCog,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  getRoleNavItems,
  getRoleWorkspaceLabel,
} from "@/config/dashboard-nav";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import type { DashboardUser, NavItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { showSuccessToast } from "@/lib/toaster";

function renderNavIcon(icon: NavItem["icon"]) {
  switch (icon) {
    case "home":
      return <Home className="h-4 w-4 shrink-0" />;
    case "plus":
      return <Plus className="h-4 w-4 shrink-0" />;
    case "list":
      return <ListChecks className="h-4 w-4 shrink-0" />;
    case "users":
      return <Users className="h-4 w-4 shrink-0" />;
    case "checkSquare":
      return <CheckSquare className="h-4 w-4 shrink-0" />;
    case "creditCard":
      return <CreditCard className="h-4 w-4 shrink-0" />;
    case "search":
      return <Search className="h-4 w-4 shrink-0" />;
    case "messageSquare":
      return <MessageSquarePlus className="h-4 w-4 shrink-0" />;
    default:
      return <Home className="h-4 w-4 shrink-0" />;
  }
}

interface DashboardSidebarProps {
  user: DashboardUser;
  onUpgradePlan?: (plan: "pro-student" | "pro-tutor") => void;
  isUpgrading?: boolean;
}

export function DashboardSidebar({
  user,
  onUpgradePlan,
  isUpgrading = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar, setOpenMobile } = useSidebar();

  const navItems = getRoleNavItems(user.role);
  const workspaceLabel = getRoleWorkspaceLabel(user.role);
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await authClient.signOut();
    showSuccessToast("Signed out successfully.");
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background"
    >
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <BrandLogo
            href="/"
            size={24}
            textClassName={cn(
              "text-base font-bold text-primary transition-opacity",
              isCollapsed && "hidden"
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {workspaceLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/dashboard/${user.role}` &&
                    item.href.startsWith("/dashboard") &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setOpenMobile(false)}
                      render={<Link href={item.href} />}
                      className={cn(
                        "h-9 rounded-lg px-3 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-secondary font-semibold text-primary"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      {renderNavIcon(item.icon)}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-Specific Promo Card (Student Pro / Tutor Pro) */}
        {!isCollapsed && user.role === "student" && user.plan === "free" && (
          <div className="px-2 pt-2">
            <Card className="border-primary/20 bg-secondary/70 shadow-none">
              <CardContent className="space-y-2.5 p-3.5">
                <p className="text-xs font-bold leading-snug text-primary">
                  A little more momentum.
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Explore Pro for $10/month.
                </p>
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpgrading}
                  onClick={() => onUpgradePlan?.("pro-student")}
                  className="h-7 w-full border border-border bg-card text-[11px] font-semibold text-primary hover:bg-card/90"
                >
                  {isUpgrading ? "Redirecting..." : "Explore Pro"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!isCollapsed && user.role === "tutor" && (
          <div className="px-2 pt-2">
            <Card className="border-primary/20 bg-secondary/70 shadow-none">
              <CardContent className="space-y-2.5 p-3.5">
                <p className="text-xs font-bold leading-snug text-primary">
                  Room to keep growing.
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {user.plan === "pro"
                    ? "Pro Tutor · $15/month active"
                    : "Pro Tutor · $15/month"}
                </p>
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpgrading || user.plan === "pro"}
                  onClick={() => onUpgradePlan?.("pro-tutor")}
                  className="h-7 w-full border border-border bg-card text-[11px] font-semibold text-primary hover:bg-card/90"
                >
                  {user.plan === "pro"
                    ? "Pro Active"
                    : isUpgrading
                    ? "Redirecting..."
                    : "Manage plan"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Back to website"
              onClick={() => setOpenMobile(false)}
              render={<Link href="/" />}
              className="h-8 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span>Back to website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/dashboard/profile"}
              tooltip="Update profile"
              onClick={() => setOpenMobile(false)}
              render={<Link href="/dashboard/profile" />}
              className={cn(
                "h-8 rounded-lg px-3 text-xs font-medium",
                pathname === "/dashboard/profile"
                  ? "bg-secondary font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UserCog className="h-3.5 w-3.5 shrink-0" />
              <span>Update profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={handleSignOut}
              className="h-8 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-destructive-tint hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="hidden md:block">
            <SidebarMenuButton
              tooltip={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleSidebar}
              className="h-8 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}