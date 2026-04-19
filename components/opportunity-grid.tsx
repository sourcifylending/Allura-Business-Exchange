import { OpportunityCard } from "@/components/opportunity-card";
import { SectionHeading } from "@/components/section-heading";
import type { OpportunityRecord } from "@/lib/opportunities";

export function OpportunityGrid({
  eyebrow,
  title,
  description,
  opportunities,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  opportunities: OpportunityRecord[];
}>) {
  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-5 lg:grid-cols-2">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={`${opportunity.listing_type}-${opportunity.title_public}`} opportunity={opportunity} />
        ))}
      </div>
    </section>
  );
}
