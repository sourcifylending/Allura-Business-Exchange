import { transferCloseoutMilestones, type TransferRecord } from "@/lib/closeout-ops";

export function CloseoutMilestones({
  transfer,
}: Readonly<{
  transfer: TransferRecord;
}>) {
  const milestones = transferCloseoutMilestones(transfer);

  return (
    <div className="grid gap-3">
      {milestones.map((milestone) => (
        <article key={milestone.label} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-ink-950">{milestone.label}</div>
              <div className="mt-1 text-sm leading-6 text-ink-600">{milestone.detail}</div>
            </div>
            <span className={statusClassName(milestone.state)}>{stateLabel(milestone.state)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function stateLabel(state: "complete" | "pending" | "blocked" | "archived") {
  switch (state) {
    case "complete":
      return "Complete";
    case "blocked":
      return "Blocked";
    case "archived":
      return "Archived";
    case "pending":
    default:
      return "Pending";
  }
}

function statusClassName(state: "complete" | "pending" | "blocked" | "archived") {
  const base = "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]";

  switch (state) {
    case "complete":
      return `${base} border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700`;
    case "blocked":
      return `${base} border-rose-200 bg-[rgba(43,13,19,0.96)] text-rose-700`;
    case "archived":
      return `${base} border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800`;
    case "pending":
    default:
      return `${base} border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700`;
  }
}
