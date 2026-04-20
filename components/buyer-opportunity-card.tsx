import Link from "next/link";
import type { BuyerOpportunityRecord } from "@/lib/buyer-opportunities";

const statusStyles = {
  incomplete: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  draft_ready: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  approved_for_listing: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
} as const;

export function BuyerOpportunityCard({
  opportunity,
  href,
  interestState,
}: Readonly<{
  opportunity: BuyerOpportunityRecord;
  href: string;
  interestState?: {
    saved?: boolean;
    interested?: boolean;
  };
}>) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
            {opportunity.asset_type}
          </div>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink-950">
            {opportunity.asset_name}
          </h3>
          <div className="mt-1 text-sm text-ink-600">{opportunity.niche}</div>
        </div>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            statusStyles[opportunity.packaging_status],
          ].join(" ")}
        >
          {opportunity.packaging_status.replaceAll("_", " ")}
        </span>
      </div>

      <p className="text-sm leading-6 text-ink-600">{opportunity.portal_summary}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Asking price" value={opportunity.asking_price} />
        <Info label="Portal visibility" value={opportunity.portal_visible ? "Visible" : "Hidden"} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {interestState?.interested ? (
          <Badge tone="emerald">Interested</Badge>
        ) : null}
        {interestState?.saved ? <Badge tone="sky">Saved</Badge> : null}
      </div>

      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
      >
        Open opportunity
      </Link>
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

function Badge({
  tone,
  children,
}: Readonly<{
  tone: "sky" | "emerald";
  children: string;
}>) {
  const toneStyles =
    tone === "emerald"
      ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
      : "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneStyles}`}>
      {children}
    </span>
  );
}
