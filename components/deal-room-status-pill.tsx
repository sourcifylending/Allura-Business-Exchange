import type { AccessStatus, ApprovalStatus, DealTimelineStatus, DocumentStatus } from "@/lib/deal-room";

export function DealAccessStatusPill({
  status,
}: Readonly<{
  status: AccessStatus;
}>) {
  const tone =
    status === "approved"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "restricted"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-amber-200 bg-amber-50 text-amber-800";
  return <Badge tone={tone}>{status}</Badge>;
}

export function DealApprovalStatusPill({
  status,
}: Readonly<{
  status: ApprovalStatus;
}>) {
  const tone =
    status === "approved"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "blocked"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-amber-200 bg-amber-50 text-amber-800";
  return <Badge tone={tone}>{status}</Badge>;
}

export function DealTimelineStatusPill({
  status,
}: Readonly<{
  status: DealTimelineStatus;
}>) {
  const tone =
    status === "complete"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "ready"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "locked"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-ink-200 bg-ink-50 text-ink-700";
  return <Badge tone={tone}>{status}</Badge>;
}

export function DealDocumentStatusPill({
  status,
}: Readonly<{
  status: DocumentStatus;
}>) {
  const tone =
    status === "available"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";
  return <Badge tone={tone}>{status}</Badge>;
}

function Badge({
  tone,
  children,
}: Readonly<{
  tone: string;
  children: string;
}>) {
  return (
    <span className={["inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase", tone].join(" ")}>
      {children}
    </span>
  );
}

