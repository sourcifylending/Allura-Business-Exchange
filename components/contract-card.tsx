import { ContractStatusPill, PaymentStatusPill, SignatureStatusPill } from "@/components/contract-status-pill";
import type { ContractRecord } from "@/lib/closeout-ops";

export function ContractCard({
  contract,
}: Readonly<{
  contract: ContractRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Contracts
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{contract.asset_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{contract.buyer_name}</div>
        </div>
        <ContractStatusPill status={contract.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Contract record ID" value={contract.contract_record_id} />
        <Detail label="Contract type" value={contract.contract_type} />
        <Detail label="Sent date" value={contract.sent_date} />
        <Detail label="Document status" value={contract.document_status} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4 sm:grid-cols-2">
        <SignatureStatusPill status={contract.signature_status} />
        <PaymentStatusPill status={contract.payment_status} />
      </div>

      <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-4 text-sm leading-6 text-ink-600">
        {contract.notes}
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

