import type { OpportunityRecord } from "@/lib/opportunities";

const statusStyles: Record<OpportunityRecord["status"], string> = {
  live: "bg-accent-100 text-accent-800 border-accent-200",
  coming_soon: "bg-ink-100 text-ink-700 border-ink-200",
  private_review: "bg-ink-100 text-ink-700 border-ink-200",
};

export function OpportunityCard({
  opportunity,
}: Readonly<{
  opportunity: OpportunityRecord;
}>) {
  const isAiAsset = opportunity.listing_type === "ai_asset";
  const isSanitizedBusiness = opportunity.listing_type === "business";

  return (
    <article
      className={[
        "overflow-hidden rounded-[1.75rem] border bg-white shadow-soft",
        isAiAsset ? "border-accent-200" : "border-ink-200",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-between gap-3 px-5 py-4",
          isAiAsset ? "bg-[rgb(var(--accent-soft))]" : "bg-ink-50",
        ].join(" ")}
      >
        <div>
          <div className="text-[11px] font-semibold tracking-[0.24em] text-ink-500 uppercase">
            {isAiAsset ? "AI Asset" : "Business Teaser"}
          </div>
          <div className="mt-1 text-sm font-medium text-ink-800">{opportunity.category}</div>
        </div>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            statusStyles[opportunity.status],
          ].join(" ")}
        >
          {opportunity.status.replace("_", " ")}
        </span>
      </div>
      <div className="grid gap-5 p-5">
        <div className="flex min-h-[120px] items-end rounded-[1.4rem] border border-ink-200 bg-gradient-to-br from-white to-ink-50 p-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.24em] text-ink-500 uppercase">
              {opportunity.cover_image}
            </div>
            <div className="mt-2 text-sm text-ink-500">{opportunity.region}</div>
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold text-ink-950">
            {isAiAsset ? opportunity.title_public : opportunity.title_public}
          </div>
          {isAiAsset ? (
            <div className="mt-1 text-sm font-medium text-accent-800">
              {opportunity.brand_name}
            </div>
          ) : (
            <div className="mt-1 text-sm font-medium text-ink-600">Sanitized by default</div>
          )}
          <p className="mt-3 text-sm leading-6 text-ink-600">{opportunity.short_description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
              Asking Price
            </div>
            <div className="mt-2 text-xl font-semibold text-ink-950">{opportunity.asking_price}</div>
            <div className="mt-1 text-sm text-ink-600">{opportunity.price_range}</div>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">
              Visibility
            </div>
            <div className="mt-2 text-sm font-medium text-ink-900">
              {opportunity.visibility_mode.replace("_", " ")}
            </div>
            <div className="mt-1 text-sm text-ink-600">
              {opportunity.nda_required ? "NDA required for deeper access" : "Public by default"}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-4 py-3 text-sm text-ink-600">
          {isAiAsset
            ? "Branded AI asset listing with public details shown directly."
            : "Business identity remains sanitized until approval or NDA unlocks deeper access."}
        </div>
        {isSanitizedBusiness ? (
          <div className="text-xs font-medium tracking-[0.16em] text-ink-500 uppercase">
            Private title: {opportunity.title_private}
          </div>
        ) : null}
      </div>
    </article>
  );
}
