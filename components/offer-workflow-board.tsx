import { OfferCard } from "@/components/offer-card";
import { SectionHeading } from "@/components/section-heading";
import { offerStageLabels, type BuyerRecord, type OfferRecord, type OfferStage } from "@/lib/closeout-ops";

export function OfferWorkflowBoard({
  title,
  description,
  records,
  editable = false,
  buyerOptions = [],
}: Readonly<{
  title: string;
  description: string;
  records: OfferRecord[];
  editable?: boolean;
  buyerOptions?: BuyerRecord[];
}>) {
  const grouped = records.reduce<Record<OfferStage, OfferRecord[]>>(
    (acc, offer) => {
      acc[offer.stage].push(offer);
      return acc;
    },
    {
      offered: [],
      countered: [],
      accepted: [],
      waiting: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-4">
        {(Object.keys(offerStageLabels) as OfferStage[]).map((stage) => (
          <div key={stage} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {offerStageLabels[stage]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[stage].length}
              </span>
            </div>
            {grouped[stage].length > 0 ? (
              <div className="mt-4 grid gap-3">
                {grouped[stage].map((offer) => (
                  <OfferCard key={offer.id} offer={offer} editable={editable} buyerOptions={buyerOptions} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-ink-200 bg-white px-4 py-5 text-sm leading-6 text-ink-500">
                No records in this stage yet.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
