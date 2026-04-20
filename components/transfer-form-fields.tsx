import type { ReactNode } from "react";
import type { BuyerRecord, TransferRecord, TransferStatus } from "@/lib/closeout-ops";
import {
  transferStatusLabels,
  transferWorkflowStatusLabels,
  transferWorkflowStatusOrder,
  normalizeTransferWorkflowStatus,
} from "@/lib/closeout-ops";

const transferWorkflowStatusOptions = transferWorkflowStatusOrder.map(
  (status) => [status, transferWorkflowStatusLabels[status]] as const,
);
const transferStatusOptions = Object.entries(transferStatusLabels) as ReadonlyArray<
  readonly [TransferStatus, string]
>;

export function TransferFormFields({
  record,
  buyerOptions,
  submitLabel,
}: Readonly<{
  record?: Partial<TransferRecord>;
  buyerOptions: BuyerRecord[];
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Asset name">
          <input name="asset_name" defaultValue={record?.asset_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Buyer">
          <select name="buyer_id" defaultValue={record?.buyer_id ?? ""} className={inputClass}>
            <option value="">Unassigned</option>
            {buyerOptions.map((buyer) => (
              <option key={buyer.id} value={buyer.id}>
                {buyer.buyer_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Buyer name">
          <input name="buyer_name" defaultValue={record?.buyer_name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Repo transfer">
          <select
            name="repo_transfer_status"
            defaultValue={record?.repo_transfer_status ?? "not_started"}
            required
            className={inputClass}
          >
            {transferStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Domain transfer">
          <select
            name="domain_transfer_status"
            defaultValue={record?.domain_transfer_status ?? "not_started"}
            required
            className={inputClass}
          >
            {transferStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hosting transfer">
          <select
            name="hosting_transfer_status"
            defaultValue={record?.hosting_transfer_status ?? "not_started"}
            required
            className={inputClass}
          >
            {transferStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Admin account transfer">
          <select
            name="admin_account_transfer_status"
            defaultValue={record?.admin_account_transfer_status ?? "not_started"}
            required
            className={inputClass}
          >
            {transferStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Overall status">
          <div className="grid gap-2">
            <select
              name="workflow_status"
              defaultValue={normalizeTransferWorkflowStatus(record?.workflow_status ?? null, record?.overall_transfer_status ?? null)}
              required
              className={inputClass}
            >
              {transferWorkflowStatusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input type="hidden" name="overall_transfer_status" value={record?.overall_transfer_status ?? "not_started"} />
          </div>
        </Field>
        <Field label="Documentation delivery">
          <input
            name="documentation_delivery"
            defaultValue={record?.documentation_delivery ?? ""}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Support window">
          <input name="support_window" defaultValue={record?.support_window ?? ""} required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Next action">
          <textarea name="next_action" defaultValue={record?.next_action ?? ""} required rows={3} className={inputClass} />
        </Field>
        <Field label="Internal notes">
          <textarea name="internal_notes" defaultValue={record?.internal_notes ?? ""} rows={3} className={inputClass} />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600">
          {submitLabel}
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">Internal admin only</span>
      </div>
    </>
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
