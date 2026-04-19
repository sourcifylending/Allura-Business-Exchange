import type { IntakeStatus, ReviewStatus } from "@/lib/business-intake";

export function BusinessIntakeStatusPill({
  status,
}: Readonly<{
  status: IntakeStatus;
}>) {
  const tone =
    status === "complete"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "needs_info"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
}

export function BusinessReviewStatusPill({
  status,
}: Readonly<{
  status: ReviewStatus;
}>) {
  const tone =
    status === "clear"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "red_flags"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : status === "hold"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
}

function Badge({
  tone,
  children,
}: Readonly<{
  tone: string;
  children: string;
}>) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
        tone,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

