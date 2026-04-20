import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { BuyerOfferQueueCard } from "@/components/buyer-offer-queue-card";
import { PageCard } from "@/components/page-card";
import { buyerOfferStatusLabels, buyerOfferSubmissionStatusOrder, getAdminBuyerOfferSubmissions } from "@/lib/buyer-offers";
import type { BuyerOfferSubmissionStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type AdminBuyerOffersPageProps = Readonly<{
  searchParams?: {
    saved?: string;
    error?: string;
    status?: BuyerOfferSubmissionStatus | "all";
  };
}>;

const filterOptions: Array<{ label: string; value: BuyerOfferSubmissionStatus | "all" }> = [
  { label: "All offers", value: "all" },
  ...buyerOfferSubmissionStatusOrder().map((status) => ({ label: buyerOfferStatusLabels[status], value: status })),
];

export default async function AdminBuyerOffersPage({ searchParams }: AdminBuyerOffersPageProps) {
  const status = searchParams?.status && buyerOfferSubmissionStatusOrder().includes(searchParams.status as BuyerOfferSubmissionStatus)
    ? (searchParams.status as BuyerOfferSubmissionStatus)
    : "all";
  const allRecords = await getAdminBuyerOfferSubmissions("all");
  const records = status === "all" ? allRecords : allRecords.filter((record) => record.status === status);
  const counts = buyerOfferSubmissionStatusOrder().reduce<Record<BuyerOfferSubmissionStatus | "all", number>>((acc, item) => {
    acc[item] = allRecords.filter((record) => record.status === item).length;
    return acc;
  }, { all: allRecords.length } as Record<BuyerOfferSubmissionStatus | "all", number>);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyer Offers"
        description="Controlled buyer offer submissions from the invite-only portal. Public users cannot see this queue."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Buyer offer {searchParams.saved === "promoted" ? "promoted" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <PageCard
        title="Offer queue"
        description="Filter buyer-submitted offers by workflow state and review them without exposing seller identity."
      >
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((option) => (
            <Link
              key={option.value}
              href={option.value === "all" ? "/admin/buyer-offers" : `/admin/buyer-offers?status=${option.value}`}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                status === option.value
                  ? "border-accent-200 bg-[rgba(31,26,18,0.96)] text-accent-700"
                  : "border-ink-200 bg-[rgb(var(--surface))] text-ink-700 hover:border-accent-300 hover:text-accent-700",
              ].join(" ")}
            >
              {option.label} ({counts[option.value] ?? 0})
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          {records.length > 0 ? (
            records.map((record) => <BuyerOfferQueueCard key={record.id} record={record} />)
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
              No buyer offer submissions match the current filter.
            </div>
          )}
        </div>
      </PageCard>
    </div>
  );
}
