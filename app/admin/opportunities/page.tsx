import { AdminPageHeader } from "@/components/admin-page-header";
import { DiscoverySummary } from "@/components/discovery-summary";
import { DiscoveryWorkflowBoard } from "@/components/discovery-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { discoveryRecords } from "@/lib/buyer-discovery";

export default function OpportunitiesPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyer Discovery"
        description="Internal research and go-to-market shell for mapping assets to buyers, channels, and positioning."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DiscoveryWorkflowBoard
          title="Asset-to-buyer discovery"
          description="A working surface for turning an asset into a buyer profile, channel plan, and positioning plan."
          records={discoveryRecords}
        />
        <DiscoverySummary records={discoveryRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Promotion Channels"
          title="Where to promote and where buyers already gather"
          description="The engine is structured to show the best places to promote each asset and where buyers already research similar software."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {discoveryRecords.map((record) => (
            <div key={record.id} className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6">
              <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {record.asset_name}
              </div>
              <div className="mt-4 text-sm leading-6 text-ink-700">
                {record.recommended_promotion_channels.join(", ")}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-600">
                Gather: {record.where_buyers_gather.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
