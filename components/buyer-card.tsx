import { BuyerFormFields } from "@/components/buyer-form-fields";
import { BuyerStatusPill } from "@/components/buyer-status-pill";
import { buyerTypeLabels, proofOfFundsLabels, type BuyerRecord, updateBuyerRecord } from "@/lib/buyer-ops";

export function BuyerCard({
  buyer,
  editable = false,
}: Readonly<{
  buyer: BuyerRecord;
  editable?: boolean;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Buyer Profile
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{buyer.buyer_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{buyerTypeLabels[buyer.buyer_type]}</div>
        </div>
        <BuyerStatusPill status={buyer.current_stage} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Budget" value={buyer.budget} />
        <Detail label="Proof of funds" value={proofOfFundsLabels[buyer.proof_of_funds_status]} />
        <Detail label="Urgency" value={buyer.urgency} />
        <Detail label="Operator / Investor" value={buyerTypeLabels[buyer.operator_or_investor]} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
        <Mini label="Niches of interest" value={buyer.niches_of_interest.join(", ")} />
        <Mini label="Asset preferences" value={buyer.asset_preferences.join(", ")} />
        <Mini label="Inquiry history" value={buyer.inquiry_history} />
        <Mini label="Next action" value={buyer.next_action} />
      </div>

      {editable ? (
        <details className="mt-5 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold tracking-[0.16em] text-accent-700 uppercase">
            Edit buyer
          </summary>
          <form action={updateBuyerRecord} className="mt-5 grid gap-5">
            <BuyerFormFields record={buyer} submitLabel="Save buyer" />
          </form>
        </details>
      ) : null}
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

function Mini({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-700">{value}</div>
    </div>
  );
}
