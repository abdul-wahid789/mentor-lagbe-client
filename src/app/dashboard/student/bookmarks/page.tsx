import { requireDashboardUser } from "@/lib/dashboard-session";
import { getServerToken } from "@/lib/server-token";
import { getMyBookmarks } from "@/lib/actions/application";
import { getApprovedTuitions } from "@/lib/actions/tuition";
import { getPaidStatus } from "@/lib/actions/payment";
import { DashboardShell } from "@/components/dashboard/shared/DashboardShell";
import {
  StudentBookmarksClient,
  type BookmarkedTuitionEntry,
} from "@/components/dashboard/student/StudentBookmarksClient";
import type { TuitionPostItem } from "@/types/dashboard";

export default async function StudentBookmarksPage() {
  const user = await requireDashboardUser(["student"]);
  const token = await getServerToken();

  const [bookmarksRes, tuitionsRes, paidRes] = await Promise.all([
    getMyBookmarks(token),
    getApprovedTuitions(token),
    getPaidStatus(token),
  ]);

  const bookmarks =
    !bookmarksRes.error && Array.isArray(bookmarksRes.data)
      ? bookmarksRes.data
      : [];

  const tuitions: TuitionPostItem[] =
    !tuitionsRes.error && Array.isArray(tuitionsRes.data)
      ? tuitionsRes.data
      : [];

  const tuitionById = new Map<string, TuitionPostItem>();
  for (const item of tuitions) {
    if (item._id) {
      tuitionById.set(String(item._id), item);
    }
  }

  const initialBookmarks: BookmarkedTuitionEntry[] = bookmarks.map(
    (bookmark) => ({
      bookmark,
      tuition: tuitionById.get(String(bookmark.tuitionId)) || null,
    })
  );

  const isPro = Boolean(
    !paidRes.error &&
      paidRes.data &&
      (paidRes.data.isPro || paidRes.data.plan === "pro")
  );

  return (
    <DashboardShell user={user} breadcrumbLabel="Bookmarks">
      <StudentBookmarksClient
        user={user}
        isPro={isPro}
        initialBookmarks={initialBookmarks}
      />
    </DashboardShell>
  );
}
