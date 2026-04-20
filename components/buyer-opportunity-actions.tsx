import { expressBuyerInterestAction, saveBuyerOpportunityAction } from "@/lib/buyer-opportunities";

export function BuyerOpportunityActions({
  opportunityId,
  interested,
  saved,
}: Readonly<{
  opportunityId: string;
  interested: boolean;
  saved: boolean;
}>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <form action={expressBuyerInterestAction}>
        <input type="hidden" name="asset_packaging_id" value={opportunityId} />
        <button
          type="submit"
          className={[
            "w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition",
            interested
              ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
              : "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700 hover:border-accent-300 hover:text-accent-600",
          ].join(" ")}
        >
          {interested ? "Interest recorded" : "Express interest"}
        </button>
      </form>
      <form action={saveBuyerOpportunityAction}>
        <input type="hidden" name="asset_packaging_id" value={opportunityId} />
        <button
          type="submit"
          className={[
            "w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition",
            saved
              ? "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700"
              : "border-ink-200 bg-[rgb(var(--surface))] text-ink-700 hover:border-accent-300 hover:text-accent-700",
          ].join(" ")}
        >
          {saved ? "Saved to watchlist" : "Save to watchlist"}
        </button>
      </form>
    </div>
  );
}
