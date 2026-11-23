"use client";

import { Suspense, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { DashboardUser } from "@/types/dashboard";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { DashboardSessionSkeleton } from "./DashboardSessionSkeleton";

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
  const router = useRouter();

  const handleUpgradePlan = async (plan: "pro-student" | "pro-tutor") => {
    setIsUpgrading(true);
    try {
      router.push(`/payment/checkout?plan=${plan}`);
    } finally {
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
            <Suspense fallback={<DashboardSessionSkeleton />}>
              {children}
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}