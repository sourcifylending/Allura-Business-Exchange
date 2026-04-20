import { transferWorkflowStatusLabels, type TransferWorkflowStatus } from "@/lib/closeout-ops";

export function TransferWorkflowStatusPill({
  status,
}: Readonly<{
  status: TransferWorkflowStatus;
}>) {
  const tone =
    status === "completed"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "ready_to_close"
        ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
        : status === "pending_docs" || status === "pending_admin"
          ? "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700"
          : status === "cancelled"
            ? "border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700"
            : "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700";

  return <Badge tone={tone}>{transferWorkflowStatusLabels[status]}</Badge>;
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
