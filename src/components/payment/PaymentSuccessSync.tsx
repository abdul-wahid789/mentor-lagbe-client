"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { showSuccessToast } from "@/lib/toaster";

export function PaymentSuccessSync() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function refreshUserPlan() {
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!active) return;

      await authClient.getSession({
        query: { disableCookieCache: true },
      });
      router.refresh();
      showSuccessToast("Pro membership is now active!");
    }

    refreshUserPlan();
    return () => {
      active = false;
    };
  }, [router]);

  return null;
}