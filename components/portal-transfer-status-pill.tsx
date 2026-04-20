import type { PortalTransferRecord } from "@/lib/portal-transfers";
import { portalTransferStatusLabel } from "@/lib/portal-transfers";

const toneByStatus: Record<PortalTransferRecord["transfer_status"], string> = {
  queued: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  in_progress: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  pending_docs: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  pending_admin: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  ready_to_close: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  completed: "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800",
  cancelled: "border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700",
};

export function PortalTransferStatusPill({
  record,
}: Readonly<{
  record: PortalTransferRecord;
}>) {
  return <Badge tone={toneByStatus[record.transfer_status]}>{portalTransferStatusLabel(record)}</Badge>;
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
