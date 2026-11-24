"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ImagePlus, Plus, Trash2, X } from "lucide-react";
import {
  deleteTuition,
  getMyTuitions,
  toggleTuitionStatus,
  updateTuition,
} from "@/lib/actions/tuition";
import { uploadAvatarToImgBB, validateAvatarFile } from "@/lib/imgbb";
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
import type { ApprovalStatus, TuitionPostItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

function getItemKey(item: TuitionPostItem, index: number): string {
  return item._id ? String(item._id) : `tuition-${index}`;
}

export function MyTuitionsClient() {
  const [tuitions, setTuitions] = useState<TuitionPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApprovalStatus>(
    "All"
  );
  const [page, setPage] = useState(1);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFee, setEditFee] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBannerUrl, setEditBannerUrl] = useState("");
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);
  const [editBannerPreview, setEditBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editBannerFile) {
      setEditBannerPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(editBannerFile);
    setEditBannerPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editBannerFile]);

  useEffect(() => {
    let active = true;

    async function loadTuitions() {
      setLoading(true);
      const res = await getMyTuitions();
      if (!active) return;

      if (res.error) {
        showErrorToast(res.msg || "Could not load your tuitions.");
      } else if (Array.isArray(res.data)) {
        setTuitions(res.data);
      }
      setLoading(false);
    }

    loadTuitions();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tuitions.filter((item) => {
      const approval = item.approvalStatus || "pending";
      const matchesStatus =
        statusFilter === "All" || approval === statusFilter;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.classLevel.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [tuitions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const openEditModal = (item: TuitionPostItem, idx: number) => {
    setEditingIndex(idx);
    setEditTitle(item.title);
    setEditFee(String(item.monthlyFee));
    setEditLocation(item.location);
    setEditDescription(item.description);
    setEditBannerUrl(item.bannerUrl || "");
    setEditBannerFile(null);
  };

  const handleBannerFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!selected) return;

    const validationError = validateAvatarFile(selected);
    if (validationError) {
      showErrorToast(validationError);
      return;
    }
    setEditBannerFile(selected);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    const target = tuitions[editingIndex];
    if (!target) return;

    const numericFee = Number(editFee);
    if (!editTitle.trim() || Number.isNaN(numericFee) || numericFee < 500) {
      showErrorToast("Enter a valid title and fee (at least ৳500).");
      return;
    }

    const id = target._id ? String(target._id) : "";
    const rowKey = getItemKey(target, editingIndex);
    setBusyKey(rowKey);

    let finalBannerUrl = editBannerUrl.trim();
    if (editBannerFile) {
      try {
        finalBannerUrl = await uploadAvatarToImgBB(editBannerFile);
      } catch (err) {
        setBusyKey(null);
        showErrorToast(
          err instanceof Error ? err.message : "Failed to upload banner image."
        );
        return;
      }
    }

    const updatedPayload: Partial<TuitionPostItem> = {
      title: editTitle.trim(),
      monthlyFee: numericFee,
      location: editLocation.trim(),
      description: editDescription.trim(),
      bannerUrl: finalBannerUrl,
    };

    const res = id
      ? await updateTuition(id, updatedPayload)
      : { error: false, msg: "Updated locally" };

    setBusyKey(null);

    if (res.error) {
      showErrorToast(res.msg || "Could not update tuition.");
      return;
    }

    setTuitions((prev) =>
      prev.map((item, idx) =>
        idx === editingIndex ? { ...item, ...updatedPayload } : item
      )
    );
    showSuccessToast("Tuition updated.");
    setEditingIndex(null);
  };

  const handleToggleActive = async (item: TuitionPostItem, idx: number) => {
    const nextActive = !(item.isActive !== false);
    const id = item._id ? String(item._id) : "";
    const rowKey = getItemKey(item, idx);
    setBusyKey(rowKey);

    const res = id
      ? await toggleTuitionStatus(id, { isActive: nextActive })
      : { error: false, msg: "Status updated" };

    setBusyKey(null);

    if (res.error) {
      showErrorToast(res.msg || "Could not update status.");
      return;
    }

    setTuitions((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, isActive: nextActive } : t))
    );
    showSuccessToast(
      nextActive ? "Tuition marked Active." : "Tuition marked Closed."
    );
  };

  const handleDelete = async (item: TuitionPostItem, idx: number) => {
    const id = item._id ? String(item._id) : "";
    const rowKey = getItemKey(item, idx);
    setBusyKey(rowKey);

    const res = id
      ? await deleteTuition(id)
      : { error: false, msg: "Deleted" };

    setBusyKey(null);

    if (res.error) {
      showErrorToast(res.msg || "Could not delete tuition.");
      return;
    }

    setTuitions((prev) => prev.filter((_, i) => i !== idx));
    showSuccessToast("Tuition deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your classroom, organized.
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your tuitions, availability, and next steps.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary"
        >
          Tutor
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_auto] lg:items-end">
        <div className="space-y-1.5">
          <Label
            htmlFor="search-tuitions"
            className="text-xs font-semibold text-foreground"
          >
            Search my tuitions
          </Label>
          <Input
            id="search-tuitions"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Title or subject..."
            className="h-10 bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="filter-approval"
            className="text-xs font-semibold text-foreground"
          >
            Approval status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter((val as "All" | ApprovalStatus) || "All");
              setPage(1);
            }}
          >
            <SelectTrigger id="filter-approval" className="h-10 w-full bg-card">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="h-10 px-4 text-xs font-semibold sm:text-sm"
          nativeButton={false}
          render={
            <Link href="/dashboard/tutor/post-tuition">
              <Plus className="mr-1.5 h-4 w-4" />
              <span>Post tuition</span>
            </Link>
          }
        />
      </div>

      <Card className="border-border bg-card shadow-xs">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <h2 className="text-base font-bold text-foreground">Your tuitions</h2>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((n) => (
                <div
                  key={n}
                  className="h-44 animate-pulse rounded-xl border border-border/60 bg-muted/40 sm:h-24"
                />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                No tuitions found.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a tuition post or adjust your search filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleItems.map((item, idx) => {
                const actualIndex = (safePage - 1) * PAGE_SIZE + idx;
                const rowKey = getItemKey(item, actualIndex);
                const isRowBusy = busyKey === rowKey;
                const approval = item.approvalStatus || "pending";
                const isActive = item.isActive !== false;

                return (
                  <div
                    key={rowKey}
                    className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/25 p-3.5 transition-colors hover:border-border sm:p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      {/* Responsive Banner Preview */}
                      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg border border-border/70 bg-secondary/50 sm:h-20 sm:w-28 md:w-32">
                        {item.bannerUrl ? (
                          <Image
                            src={item.bannerUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary/15 via-secondary/70 to-primary/5 px-2 text-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="max-w-full truncate text-[10px] font-semibold text-primary/90 sm:hidden">
                              {item.subject}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.subject} · {item.classLevel} · ৳
                          {Number(item.monthlyFee || 0).toLocaleString()}/month
                        </p>

                        {approval === "rejected" && (
                          <p className="pt-0.5 text-xs font-medium text-destructive">
                            Review note:{" "}
                            {item.rejectionNote ||
                              "Add a clearer weekly schedule or subject details and resubmit."}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
                      <span
                        className={cn(
                          "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold capitalize",
                          approval === "approved"
                            ? "border-success/35 bg-success-tint text-success"
                            : approval === "rejected"
                            ? "border-destructive/30 bg-destructive-tint text-destructive"
                            : "border-warning/35 bg-warning-tint text-warning"
                        )}
                      >
                        {approval}
                      </span>

                      <button
                        type="button"
                        disabled={isRowBusy}
                        onClick={() => handleToggleActive(item, actualIndex)}
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                          isActive
                            ? "border-primary/25 bg-card text-primary hover:bg-secondary/60"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isActive
                              ? "bg-primary"
                              : "border border-muted-foreground bg-transparent"
                          )}
                        />
                        <span>{isActive ? "Active" : "Closed"}</span>
                      </button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={isRowBusy}
                        onClick={() => openEditModal(item, actualIndex)}
                        className="h-7 bg-secondary px-3 text-xs font-semibold text-primary hover:bg-secondary/80"
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isRowBusy}
                        onClick={() => handleDelete(item, actualIndex)}
                        className="h-7 border-destructive/20 bg-destructive-tint/70 px-3 text-xs font-semibold text-destructive hover:bg-destructive-tint"
                      >
                        {isRowBusy ? "Saving..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-primary">
            <p>
              Showing {visibleItems.length} of {filtered.length} tuitions ·{" "}
              <span className="font-mono">
                {safePage} / {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-3">
              {safePage > 1 && (
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  &larr; Prev
                </button>
              )}
              {safePage < totalPages && (
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  Next &rarr;
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-border bg-card shadow-lg">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">
                  Edit tuition
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  aria-label="Close edit modal"
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Tuition title</Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-fee">Monthly fee (BDT)</Label>
                    <Input
                      id="edit-fee"
                      type="number"
                      value={editFee}
                      onChange={(e) => setEditFee(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-location">Location / link</Label>
                    <Input
                      id="edit-location"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-desc">Description</Label>
                  <textarea
                    id="edit-desc"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Tuition banner</Label>
                  <div className="rounded-xl border border-border bg-background/70 p-3">
                    {editBannerPreview || editBannerUrl ? (
                      <div className="space-y-2.5">
                        <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border bg-muted">
                          <Image
                            src={editBannerPreview || editBannerUrl}
                            alt="Tuition banner preview"
                            fill
                            sizes="(max-width: 640px) 100vw, 512px"
                            unoptimized={Boolean(editBannerPreview)}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="truncate text-xs text-muted-foreground">
                            {editBannerFile
                              ? `${editBannerFile.name} · Ready to upload`
                              : "Current banner"}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={busyKey !== null}
                              onClick={() => bannerInputRef.current?.click()}
                              className="h-8 px-3 text-xs font-medium text-primary"
                            >
                              Change image
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={busyKey !== null}
                              onClick={() => {
                                setEditBannerFile(null);
                                setEditBannerUrl("");
                              }}
                              className="h-8 border-destructive/25 bg-destructive-tint/60 px-2.5 text-xs font-medium text-destructive"
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, WebP, or GIF up to 5 MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyKey !== null}
                          onClick={() => bannerInputRef.current?.click()}
                          className="h-8 border-primary/25 bg-card px-3 text-xs font-semibold text-primary hover:bg-secondary/60"
                        >
                          <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                          Choose image
                        </Button>
                      </div>
                    )}
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={busyKey !== null}
                      onChange={handleBannerFileSelect}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={busyKey !== null}
                  onClick={handleSaveEdit}
                >
                  {busyKey !== null ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}