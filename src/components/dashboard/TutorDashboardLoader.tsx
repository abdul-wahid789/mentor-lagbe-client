"use client";

import { useEffect, useState } from "react";
import { getMyTuitions } from "@/lib/actions/tuition";
import { getTutorApplicants } from "@/lib/actions/application";
import { showErrorToast } from "@/lib/toaster";
import { TutorOverview } from "@/components/dashboard/TutorOverview";
import type {
  DashboardUser,
  StudentApplicationItem,
  TuitionPostItem,
} from "@/types/dashboard";
import { useSession } from "@/lib/auth-client";
import { getPaidStatus } from "@/lib/actions/payment";

interface TutorDashboardLoaderProps {
  user: DashboardUser;
}

export function TutorDashboardLoader({ user }: TutorDashboardLoaderProps) {
  const [tuitions, setTuitions] = useState<TuitionPostItem[]>([]);
  const [applicants, setApplicants] = useState<StudentApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("sdfsd")
  console.log("name", getPaidStatus())
  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      setLoading(true);


      const [tuitionsRes, applicantsRes] = await Promise.all([
        getMyTuitions(),
        getTutorApplicants(),
      ]);

      if (!active) return;

      if (tuitionsRes.error) {
        showErrorToast(tuitionsRes.msg || "Could not load your tuitions.");
      } else if (Array.isArray(tuitionsRes.data)) {
        setTuitions(tuitionsRes.data);
      }

      if (applicantsRes.error) {
        showErrorToast(applicantsRes.msg || "Could not load applicants.");
      } else if (Array.isArray(applicantsRes.data)) {
        setApplicants(applicantsRes.data);
      }

      setLoading(false);
    }

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-muted/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-28 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
      </div>
    );
  }

  return (
    <TutorOverview
      user={user}
      tuitions={tuitions}
      applicants={applicants}
    />
  );
}