import { ApplicationStatusPill } from "@/components/application-status-pill";
import { PageCard } from "@/components/page-card";
import { formatApplicationDate } from "@/lib/application-review";
import type { BuyerApplicationRow, SellerApplicationRow } from "@/lib/supabase/database.types";

type PortalApplicationRecord = BuyerApplicationRow | SellerApplicationRow;

export function PortalAccessSummary({
  title,
  description,
  record,
  accountTypeLabel,
  summaryItems,
}: Readonly<{
  title: string;
  description: string;
  record: PortalApplicationRecord;
  accountTypeLabel: string;
  summaryItems: Array<{
    label: string;
    value: string;
  }>;
}>) {
  return (
    <PageCard title={title} description={description}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1 text-sm text-ink-600">
          <div>
            <span className="font-semibold text-ink-900">Email:</span> {record.email}
          </div>
          <div>
            <span className="font-semibold text-ink-900">Phone:</span> {record.phone}
          </div>
          <div>
            <span className="font-semibold text-ink-900">Account type:</span> {accountTypeLabel}
          </div>
        </div>
        <ApplicationStatusPill status={record.status} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <Field key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Created at" value={formatApplicationDate(record.created_at)} />
        <Field label="Updated at" value={formatApplicationDate(record.updated_at)} />
        <Field label="Current status" value={record.status.replaceAll("_", " ")} />
      </div>
    </PageCard>
  );
}

function Field({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
