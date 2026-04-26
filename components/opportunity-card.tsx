import type { OpportunityRecord } from "@/lib/opportunities";

const statusStyles: Record<OpportunityRecord["status"], string> = {
  live: "bg-[rgba(212,172,92,0.14)] text-accent-700 border-accent-200",
  coming_soon: "bg-[rgb(var(--surface))] text-ink-500 border-ink-200",
  private_review: "bg-[rgb(var(--surface))] text-ink-500 border-ink-200",
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
        "overflow-hidden rounded-[1.25rem] border bg-[rgb(var(--surface-strong))] shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-[1.75rem]",
        isAiAsset ? "border-accent-200" : "border-ink-200",
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-5 sm:py-4",
          isAiAsset ? "bg-[rgba(160, 120, 50, 0.96)]" : "bg-[rgb(var(--surface))]",
        ].join(" ")}
      >
        <div>
          <div className="text-[11px] font-semibold tracking-[0.24em] text-ink-500 uppercase">
            {isAiAsset ? "AI Asset" : "Business Teaser"}
          </div>
          <div className="mt-1 text-xs font-medium text-ink-800 sm:text-sm">{opportunity.category}</div>
        </div>
        <span
          className={[
            "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] sm:px-3 sm:text-xs",
            statusStyles[opportunity.status],
          ].join(" ")}
        >
          {opportunity.status.replace("_", " ")}
        </span>
      </div>
      <div className="grid gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="flex min-h-[100px] flex-col justify-between rounded-[1rem] border border-ink-200 bg-gradient-to-br from-[rgb(var(--surface-strong))] via-[rgb(var(--surface))] to-[rgba(160, 120, 50, 0.96)] p-3 sm:min-h-[120px] sm:rounded-[1.4rem] sm:p-4">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="text-[10px] font-semibold tracking-[0.24em] text-ink-500 uppercase sm:text-[11px]">
              {opportunity.cover_image}
            </div>
            <div className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-ink-500 uppercase sm:px-3 sm:text-[11px]">
              {opportunity.region}
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:mt-5">
            <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
              {opportunity.listing_type === "ai_asset" ? "Primary product lane" : "Secondary business lane"}
            </div>
            <div className="text-xs leading-5 text-ink-600 sm:text-sm sm:leading-6">
              {opportunity.listing_type === "ai_asset"
                ? "Branded digital product shown openly with price and positioning."
                : "Sanitized operating business presented as a controlled teaser."}
            </div>
          </div>
        </div>
        <div>
          <div className="text-base font-semibold tracking-tight text-ink-950 sm:text-lg">
            {opportunity.title_public}
          </div>
          {isAiAsset ? (
            <div className="mt-1 text-xs font-medium text-accent-800 sm:text-sm">
              {opportunity.brand_name}
            </div>
          ) : (
            <div className="mt-1 text-xs font-medium text-ink-600 sm:text-sm">Sanitized by default</div>
          )}
          <p className="mt-2 text-xs leading-5 text-ink-600 sm:mt-3 sm:text-sm sm:leading-6">{opportunity.short_description}</p>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-200 bg-[rgb(var(--surface))] p-3 sm:rounded-2xl sm:p-4">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-ink-500 uppercase sm:text-[11px]">
              Asking Price
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">
              {opportunity.asking_price}
            </div>
            <div className="mt-1 text-xs text-ink-600 sm:text-sm">{opportunity.price_range}</div>
          </div>
          <div className="rounded-xl border border-ink-200 bg-[rgb(var(--surface))] p-3 sm:rounded-2xl sm:p-4">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-ink-500 uppercase sm:text-[11px]">
              Visibility
            </div>
            <div className="mt-2 text-xs font-medium text-ink-900 sm:text-sm">
              {opportunity.visibility_mode.replace("_", " ")}
            </div>
            <div className="mt-1 text-xs text-ink-600 sm:text-sm">
              {opportunity.nda_required ? "NDA required for deeper access" : "Public by default"}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-3 py-2 text-xs text-ink-600 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
          {isAiAsset
            ? "Branded AI asset listing with public details shown directly."
            : "Business identity remains sanitized until approval or NDA unlocks deeper access."}
        </div>
        {isSanitizedBusiness ? (
          <div className="text-[10px] font-medium tracking-[0.16em] text-ink-500 uppercase sm:text-xs">
            Private title: {opportunity.title_private}
          </div>
        ) : null}
      </div>
    </article>
  );
}
