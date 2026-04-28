import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { buyerOfferSubmissionStatusOrder, getAdminBuyerOfferSubmissions } from "@/lib/buyer-offers";
import { closingStatusOrder, getClosingDeskRecords } from "@/lib/closing-ops";

export const dynamic = "force-dynamic";

export default async function AdminDealsPage() {
  const [buyerOffers, closings] = await Promise.all([getAdminBuyerOfferSubmissions("all"), getClosingDeskRecords()]);

  const buyerOfferCount = buyerOffers.length;
  const convertedCount = buyerOffers.filter((record) => record.status === "converted_to_offer").length;
  const activeClosingCount = closings.filter((record) => record.closing_status !== "closed" && record.closing_status !== "cancelled").length;
  const closedCount = closings.filter((record) => record.closing_status === "closed").length;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Deals"
        description="Manage buyer offers, active closings, and the handoff path from review to close."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Buyer offers" value={buyerOfferCount} />
        <Metric label="Converted" value={convertedCount} />
        <Metric label="Active closings" value={activeClosingCount} />
        <Metric label="Closed" value={closedCount} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <PageCard
          title="Buyer offers"
          description="Review invite-only submissions and move converted offers into the closing workflow."
        >
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Total submissions: {buyerOfferCount}</div>
            <div>Statuses available: {buyerOfferSubmissionStatusOrder().length}</div>
            <Link
              href="/admin/deals/buyer-offers"
              className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(160,120,50,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
            >
              Open buyer offers
            </Link>
          </div>
        </PageCard>

        <PageCard
          title="Closing desk"
          description="Track purchase agreement, payment, transfer checklist, and closure in one place."
        >
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Active closings: {activeClosingCount}</div>
            <div>Closing stages tracked: {closingStatusOrder.length}</div>
            <Link
              href="/admin/deals/closing-desk"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Open closing desk
            </Link>
          </div>
        </PageCard>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: number;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-ink-950">{value}</div>
    </div>
  );
}
