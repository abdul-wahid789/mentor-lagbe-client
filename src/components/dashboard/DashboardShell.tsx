"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { DashboardUser } from "@/types/dashboard";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

interface DashboardShellProps {
  user: DashboardUser;
  breadcrumbLabel?: string;
  children: ReactNode;
}

export function DashboardShell({
  user,
  breadcrumbLabel,
  children,
}: DashboardShellProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgradePlan = async (plan: "pro-student" | "pro-tutor") => {
    setIsUpgrading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Could not start Stripe Checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start Stripe payment."
      );
      setIsUpgrading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <DashboardSidebar
          user={user}
          onUpgradePlan={handleUpgradePlan}
          isUpgrading={isUpgrading}
        />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
          <DashboardTopbar user={user} breadcrumbLabel={breadcrumbLabel} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}