"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  updateUserRole,
  type AdminUserRecord,
} from "@/lib/actions/admin";
import { showErrorToast, showSuccessToast } from "@/lib/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/types/dashboard";

const PAGE_SIZE = 6;

interface AdminUsersClientProps {
  initialUsers: AdminUserRecord[];
}

interface PendingAdminGrant {
  user: AdminUserRecord;
  nextRole: "admin";
}

function formatRoleLabel(role: UserRole): string {
  if (role === "tutor") return "Tutor";
  if (role === "admin") return "Admin";
  return "Student";
}

function formatPlanLabel(plan: AdminUserRecord["plan"]): string {
  return plan === "pro" ? "Pro" : "Free";
}

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>(
    Array.isArray(initialUsers) ? initialUsers : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingGrant, setPendingGrant] = useState<PendingAdminGrant | null>(
    null
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return users.filter((u) => {
      const matchesQuery =
        !q ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q);

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesQuery && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const applyRoleChange = async (targetUser: AdminUserRecord, nextRole: UserRole) => {
    if (!targetUser.id || targetUser.role === nextRole) return;

    setUpdatingId(targetUser.id);
    try {
      const res = await updateUserRole(targetUser.id, { role: nextRole });
      if (res.error) {
        showErrorToast(res.msg || "Could not update user role.");
        return;
      }

      setUsers((prev) =>
        prev.map((item) =>
          item.id === targetUser.id ? { ...item, role: nextRole } : item
        )
      );

      showSuccessToast(
        `${targetUser.name}'s role updated to ${formatRoleLabel(nextRole)}.`
      );
    } finally {
      setUpdatingId(null);
      setPendingGrant(null);
    }
  };

  const handleRoleSelect = (targetUser: AdminUserRecord, rawRole: string | null) => {
    if (!rawRole) return;
    const nextRole = rawRole as UserRole;
    if (nextRole === targetUser.role) return;

    if (nextRole === "admin") {
      setPendingGrant({ user: targetUser, nextRole: "admin" });
      return;
    }

    void applyRoleChange(targetUser, nextRole);
  };

  const isFiltered = searchQuery.trim().length > 0 || roleFilter !== "all";
  const showingStart = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(
    startIndex + visibleUsers.length,
    filteredUsers.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          The people behind the progress.
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage account roles across your community.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="admin-user-search"
            className="text-xs font-semibold text-foreground"
          >
            Search users
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-user-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Name or email..."
              className="h-10 bg-card pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="admin-user-role-filter"
            className="text-xs font-semibold text-foreground"
          >
            Role
          </Label>
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger
              id="admin-user-role-filter"
              className="h-10 w-full bg-card"
            >
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="tutor">Tutor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Community Members Card */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">
            Community members
          </h2>

          {filteredUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 p-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                No matching users found.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your name, email, or role filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table View (sm+) */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="rounded-tl-lg px-4 py-3">User</th>
                      <th className="px-4 py-3">Current role</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="rounded-tr-lg px-4 py-3">Manage role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleUsers.map((member, idx) => {
                      const rowId = member.id || `user-${idx}`;
                      const isBusy = updatingId === member.id;

                      return (
                        <tr
                          key={rowId}
                          className="transition-colors hover:bg-muted/20"
                        >
                          <td className="px-4 py-4 align-middle">
                            <p className="text-sm font-bold text-foreground">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <Badge
                              variant="secondary"
                              className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
                            >
                              {formatRoleLabel(member.role)}
                            </Badge>
                          </td>

                          <td className="px-4 py-4 align-middle text-xs font-medium text-muted-foreground">
                            {formatPlanLabel(member.plan)}
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <div className="w-fit space-y-1">
                              <Select
                                value={member.role}
                                disabled={isBusy}
                                onValueChange={(val) =>
                                  handleRoleSelect(member, val)
                                }
                              >
                                <SelectTrigger className="h-9 min-w-28 bg-card text-xs font-semibold text-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">
                                    Student
                                  </SelectItem>
                                  <SelectItem value="tutor">Tutor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-[11px] text-muted-foreground">
                                Student · Tutor · Admin
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (<sm) */}
              <div className="space-y-4 sm:hidden">
                {visibleUsers.map((member, idx) => {
                  const rowId = member.id || `mobile-user-${idx}`;
                  const isBusy = updatingId === member.id;

                  return (
                    <div
                      key={rowId}
                      className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>

                      <Badge
                        variant="secondary"
                        className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {formatRoleLabel(member.role)}
                      </Badge>

                      <p className="text-xs font-medium text-muted-foreground">
                        {formatPlanLabel(member.plan)}
                      </p>

                      <div className="w-fit space-y-1 pt-0.5">
                        <Select
                          value={member.role}
                          disabled={isBusy}
                          onValueChange={(val) => handleRoleSelect(member, val)}
                        >
                          <SelectTrigger className="h-9 min-w-28 bg-card text-xs font-semibold text-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="tutor">Tutor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[11px] text-muted-foreground">
                          Student · Tutor · Admin
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <p className="font-medium text-primary tabular-nums">
                  {isFiltered
                    ? `Showing ${showingStart}–${showingEnd} of ${filteredUsers.length} filtered users`
                    : `Showing ${visibleUsers.length} of ${users.length.toLocaleString()} users`}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="font-medium text-primary transition-colors hover:underline disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footnote */}
      <p className="text-xs text-muted-foreground">
        Role changes affect dashboard access. Ask for confirmation before
        granting Admin access.
      </p>

      {/* Confirmation Modal Before Granting Admin Access */}
      {pendingGrant && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="grant-admin-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <Card className="w-full max-w-md border-border bg-card shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2
                    id="grant-admin-title"
                    className="text-lg font-bold text-foreground"
                  >
                    Grant Admin access?
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong>{pendingGrant.user.name}</strong> (
                    {pendingGrant.user.email}) will gain full Admin workspace
                    access, including user role management, tuition approvals,
                    and transaction records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPendingGrant(null)}
                  aria-label="Close confirmation dialog"
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={updatingId === pendingGrant.user.id}
                  onClick={() => setPendingGrant(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={updatingId === pendingGrant.user.id}
                  onClick={() =>
                    void applyRoleChange(pendingGrant.user, "admin")
                  }
                >
                  {updatingId === pendingGrant.user.id
                    ? "Granting..."
                    : "Confirm Admin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}