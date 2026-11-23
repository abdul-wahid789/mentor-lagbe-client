"use client";

import { BrowseTuitionsClient } from "@/components/tuitions/BrowseTuitionsClient";

export function DashboardBrowseTuitionsClient() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-6 sm:-my-8">
      <BrowseTuitionsClient fromDashboard />
    </div>
  );
}