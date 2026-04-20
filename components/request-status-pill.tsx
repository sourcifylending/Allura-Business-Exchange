import type { PortalRequestSummaryRecord } from "@/lib/portal-requests";

function requestTone(record: PortalRequestSummaryRecord) {
  if (record.is_overdue) {
    return "border-amber-200 bg-[rgba(45,33,10,0.96)] text-amber-700";
  }

  switch (record.status) {
    case "completed":
      return "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700";
    case "blocked":
    case "cancelled":
      return "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700";
    case "acknowledged":
    case "in_progress":
      return "border-accent-200 bg-[rgba(31,26,18,0.96)] text-accent-700";
    case "open":
    default:
      return "border-ink-200 bg-[rgb(var(--surface))] text-ink-700";
  }
}

export function RequestStatusPill({
  record,
}: Readonly<{
  record: PortalRequestSummaryRecord;
}>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
        requestTone(record),
      ].join(" ")}
    >
      {record.safe_status_label}
    </span>
  );
}
