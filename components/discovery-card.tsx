import type { DiscoveryRecord } from "@/lib/buyer-discovery";
import { DiscoveryChannelList } from "@/components/discovery-channel-list";
import { DiscoverySegmentCard } from "@/components/discovery-segment-card";
import { DiscoveryPositioningCard } from "@/components/discovery-positioning-card";

export function DiscoveryCard({
  record,
}: Readonly<{
  record: DiscoveryRecord;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Asset to Buyer Discovery
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{record.asset_name}</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Segment label="Ideal buyer profile" value={record.ideal_buyer_profile} />
        <Segment label="Likely decision-maker" value={record.likely_decision_maker} />
        <Segment label="Buyer company type" value={record.likely_buyer_company_type} />
        <Segment label="Best places to promote" value={record.best_places_to_promote.join(", ")} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <DiscoveryChannelList
          title="Promotion channels"
          items={record.recommended_promotion_channels}
        />
        <DiscoveryChannelList
          title="Communities / Directories / Events"
          items={record.recommended_communities_directories_events}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <DiscoverySegmentCard
          title="Target segments"
          description={record.top_target_company_ideas.join(", ")}
        />
        <DiscoveryPositioningCard
          title="Positioning angle"
          angle={record.suggested_positioning_angle}
          categories={record.comparable_software_categories}
        />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        Where buyers gather: {record.where_buyers_gather.join(", ")}
      </div>
    </article>
  );
}

function Segment({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

