import type { PackagingStatus } from "@/lib/packaging";

export function PackagingStatusPill({
  status,
}: Readonly<{
  status: PackagingStatus;
}>) {
  const tone =
    status === "approved_for_listing"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "draft_ready"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-ink-200 bg-ink-50 text-ink-700";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
        tone,
      ].join(" ")}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

