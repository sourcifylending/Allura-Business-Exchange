import { RiskLevelPill, UnderwritingStatusPill } from "@/components/underwriting-status-pill";
import type { BusinessUnderwritingRecord } from "@/lib/business-underwriting";

export function UnderwritingCard({
  record,
}: Readonly<{
  record: BusinessUnderwritingRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Underwriting
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.business_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{record.industry}</div>
        </div>
        <UnderwritingStatusPill status={record.overall_underwriting_status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Location" value={record.location} />
        <Detail label="Years in business" value={record.years_in_business} />
        <Detail label="Monthly revenue" value={record.monthly_revenue_range} />
        <Detail label="Cash flow / profit" value={record.cash_flow_profit_range} />
        <Detail label="SDE / owner benefit" value={record.sde_owner_benefit_placeholder} />
        <Detail label="Debt / MCA / liens" value={record.debt_mca_lien_status} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
        <Mini label="Customer concentration" value={record.customer_concentration} />
        <Mini label="Owner dependence" value={record.owner_dependence} />
        <Mini label="Transferability" value={record.transferability} />
        <Mini label="Margin quality" value={record.margin_quality} />
        <Mini label="Growth opportunity" value={record.growth_opportunity} />
        <Mini label="Closing friction" value={record.closing_friction} />
        <Mini label="Spread potential" value={record.spread_potential} />
        <Mini label="Next action" value={record.next_action} />
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

