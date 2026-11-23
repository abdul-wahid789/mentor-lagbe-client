export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
}