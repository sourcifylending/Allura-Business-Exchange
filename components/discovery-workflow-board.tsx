import { DiscoveryCard } from "@/components/discovery-card";
import { SectionHeading } from "@/components/section-heading";
import type { DiscoveryRecord } from "@/lib/buyer-discovery";

export function DiscoveryWorkflowBoard({
  title,
  description,
  records,
}: Readonly<{
  title: string;
  description: string;
  records: DiscoveryRecord[];
}>) {
  return (
    <section className="grid gap-5">
      <SectionHeading eyebrow="Workflow" title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-3">
        {records.map((record) => (
          <DiscoveryCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}

