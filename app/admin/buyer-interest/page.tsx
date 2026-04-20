import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { BuyerOpportunityQueueCard } from "@/components/buyer-opportunity-queue-card";
import { PageCard } from "@/components/page-card";
import { getAdminBuyerOpportunityInterests } from "@/lib/buyer-opportunities";
import type { BuyerOpportunityInteractionType } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type BuyerInterestPageProps = Readonly<{
  searchParams?: {
    type?: "all" | BuyerOpportunityInteractionType;
  };
}>;

const filterOptions: Array<{ label: string; value: "all" | BuyerOpportunityInteractionType }> = [
  { label: "All activity", value: "all" },
  { label: "Interest", value: "interest" },
  { label: "Saved", value: "saved" },
];

export default async function BuyerInterestPage({ searchParams }: BuyerInterestPageProps) {
  const type = searchParams?.type === "interest" || searchParams?.type === "saved" ? searchParams.type : "all";
  const allRecords = await getAdminBuyerOpportunityInterests("all");
  const records = type === "all" ? allRecords : allRecords.filter((record) => record.interaction_type === type);
  const counts = {
    all: allRecords.length,
    interest: allRecords.filter((record) => record.interaction_type === "interest").length,
    saved: allRecords.filter((record) => record.interaction_type === "saved").length,
  };

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyer Interest"
        description="Controlled buyer interest activity from the invite-only portal. This queue stays separate from public lead capture."
      />

      <PageCard
        title="Interest queue"
        description="Use the filters below to scan interest and watchlist activity from activated buyer users."
      >
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((option) => (
            <Link
              key={option.value}
              href={option.value === "all" ? "/admin/buyer-interest" : `/admin/buyer-interest?type=${option.value}`}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                type === option.value
                  ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
                  : "border-ink-200 bg-[rgb(var(--surface))] text-ink-700 hover:border-accent-300 hover:text-accent-700",
              ].join(" ")}
            >
              {option.label} ({counts[option.value] ?? 0})
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          {records.length > 0 ? (
            records.map((record) => <BuyerOpportunityQueueCard key={record.id} record={record} />)
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
              No buyer interest activity matches the current filter.
            </div>
          )}
        </div>
      </PageCard>

      <PageCard
        title="Review notes"
        description="Buyer interest remains controlled and admin-visible only. Public users cannot see this queue."
      >
        <div className="grid gap-3 text-sm leading-6 text-ink-700">
          <div>Interest and watchlist actions are recorded from the buyer portal only.</div>
          <div>Use the links on each row to jump back to the buyer application or opportunity detail.</div>
        </div>
      </PageCard>
    </div>
  );
}
