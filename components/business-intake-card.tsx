import { BusinessIntakeStatusPill, BusinessReviewStatusPill } from "@/components/business-intake-status-pill";
import type { BusinessIntakeRecord } from "@/lib/business-intake";

export function BusinessIntakeCard({
  record,
}: Readonly<{
  record: BusinessIntakeRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Seller Intake
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.legal_business_name}</h3>
          <div className="mt-1 text-sm text-ink-600">{record.dba || "No DBA listed"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <BusinessIntakeStatusPill status={record.intake_status} />
          <BusinessReviewStatusPill status={record.review_status} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Industry" value={record.industry} />
        <Detail label="Location" value={record.location} />
        <Detail label="Years in business" value={record.years_in_business} />
        <Detail label="Employees" value={record.number_of_employees} />
        <Detail label="Monthly revenue" value={record.monthly_revenue_range} />
        <Detail label="Cash flow / profit" value={record.cash_flow_profit_range} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4">
        <Mini label="Reason for selling" value={record.reason_for_selling} />
        <Mini label="Debt / liens / MCA" value={record.debt_liens_mca_disclosure} />
        <Mini label="Owner involvement" value={record.owner_involvement} />
        <Mini label="Transferability" value={record.transferability_notes} />
        <Mini label="Equipment / assets" value={record.equipment_assets} />
        <Mini label="Next action" value={record.next_action} />
      </div>

      <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-4 text-sm text-ink-600">
        Upload placeholders: {record.uploads_placeholder_list.join(", ")}
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

