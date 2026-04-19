import { BuyerCard } from "@/components/buyer-card";
import { SectionHeading } from "@/components/section-heading";
import type { BuyerRecord, BuyerStage } from "@/lib/buyer-ops";
import { buyerStageLabels } from "@/lib/buyer-ops";

export function BuyerStageBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: BuyerRecord[];
}>) {
  const grouped = records.reduce<Record<BuyerStage, BuyerRecord[]>>(
    (acc, buyer) => {
      acc[buyer.current_stage].push(buyer);
      return acc;
    },
    {
      new: [],
      qualified: [],
      active: [],
      watching: [],
      closed: [],
    },
  );

  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Buyer Status" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-5">
        {(Object.keys(buyerStageLabels) as BuyerStage[]).map((stage) => (
          <div key={stage} className="rounded-[1.5rem] border border-ink-200 bg-ink-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-ink-700 uppercase">
                {buyerStageLabels[stage]}
              </h3>
              <span className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-700">
                {grouped[stage].length}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {grouped[stage].map((buyer) => (
                <BuyerCard key={buyer.id} buyer={buyer} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

