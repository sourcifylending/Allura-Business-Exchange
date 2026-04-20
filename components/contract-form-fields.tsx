import type { ReactNode } from "react";
import type { BuyerRecord, ContractRecord } from "@/lib/closeout-ops";
import {
  contractWorkflowStatusLabels,
  contractStatusOrder,
  normalizeContractStatus,
  paymentStatusLabels,
  signatureStatusLabels,
} from "@/lib/closeout-ops";

const contractStatusOptions = contractStatusOrder.map((status) => [status, contractWorkflowStatusLabels[status]] as const);
const signatureStatusOptions = Object.entries(signatureStatusLabels) as Array<
  [keyof typeof signatureStatusLabels, string]
>;
const paymentStatusOptions = Object.entries(paymentStatusLabels) as Array<
  [keyof typeof paymentStatusLabels, string]
>;

export function ContractFormFields({
  record,
  buyerOptions,
  submitLabel,
}: Readonly<{
  record?: Partial<ContractRecord>;
  buyerOptions: BuyerRecord[];
  submitLabel: string;
}>) {
  return (
    <>
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Field label="Contract record ID">
          <input name="contract_record_id" defaultValue={record?.contract_record_id ?? ""} required className={inputClass} />
        </Field>
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
        <Field label="Contract type">
          <input name="contract_type" defaultValue={record?.contract_type ?? ""} required className={inputClass} />
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={record?.status ? normalizeContractStatus(record.status) : "draft"}
            required
            className={inputClass}
          >
            {contractStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sent date">
          <input type="date" name="sent_date" defaultValue={record?.sent_date ?? ""} required className={inputClass} />
        </Field>
        <Field label="Signature status">
          <select
            name="signature_status"
            defaultValue={record?.signature_status ?? "not_sent"}
            required
            className={inputClass}
          >
            {signatureStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Document status">
          <input name="document_status" defaultValue={record?.document_status ?? ""} required className={inputClass} />
        </Field>
        <Field label="Payment status">
          <select
            name="payment_status"
            defaultValue={record?.payment_status ?? "pending"}
            required
            className={inputClass}
          >
            {paymentStatusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Notes">
          <textarea name="notes" defaultValue={record?.notes ?? ""} required rows={4} className={inputClass} />
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
