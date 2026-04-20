import type { ReactNode } from "react";
import {
  normalizeTransferWorkflowStatus,
  transferWorkflowStatusLabels,
  transferWorkflowStatusOrder,
  type TransferRecord,
} from "@/lib/closeout-ops";

const workflowStatusOptions = transferWorkflowStatusOrder.map(
  (status) => [status, transferWorkflowStatusLabels[status]] as const,
);

export function TransferWorkflowUpdateForm({
  record,
  submitLabel,
  action,
  returnTo,
}: Readonly<{
  record: Partial<TransferRecord>;
  submitLabel: string;
  action: string | ((formData: FormData) => void | Promise<void>);
  returnTo: string;
}>) {
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="id" value={record.id ?? ""} />
      <input type="hidden" name="return_to" value={returnTo} />

      <Field label="Workflow status">
        <select
          name="workflow_status"
          defaultValue={normalizeTransferWorkflowStatus(record.workflow_status ?? null, record.overall_transfer_status ?? null)}
          required
          className={inputClass}
        >
          {workflowStatusOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Internal notes">
        <textarea name="internal_notes" defaultValue={record.internal_notes ?? ""} rows={4} className={inputClass} />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          {submitLabel}
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">Admin only</span>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
