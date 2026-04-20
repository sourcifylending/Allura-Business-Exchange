import Link from "next/link";
import type { BuyerOpportunityInteractionRecord } from "@/lib/buyer-opportunities";

const actionStyles: Record<BuyerOpportunityInteractionRecord["interaction_type"], string> = {
  interest: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  saved: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
};

export function BuyerOpportunityQueueCard({
  record,
}: Readonly<{
  record: BuyerOpportunityInteractionRecord;
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            {record.buyer_name}
          </div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{record.buyer_email}</div>
        </div>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            actionStyles[record.interaction_type],
          ].join(" ")}
        >
          {record.interaction_type}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Opportunity" value={record.asset_name} />
        <Info label="Category" value={record.niche} />
        <Info label="Type" value={record.asset_type} />
        <Info label="Price" value={record.asking_price} />
      </div>

      <div className="text-sm text-ink-600">
        Submitted {new Date(record.created_at).toLocaleDateString()} • {record.packaging_status.replaceAll("_", " ")}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/applications/buyers/${record.buyer_application_id}`}
          className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
        >
          Open buyer application
        </Link>
        <Link
          href={`/portal/buyer/opportunities/${record.asset_packaging_id}`}
          className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open opportunity
        </Link>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}
