import Link from "next/link";
import { BuyerOfferActivityCard } from "@/components/buyer-offer-activity-card";
import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { getBuyerPortalOfferSubmissions } from "@/lib/buyer-offers";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type BuyerOffersPageProps = Readonly<{
  searchParams?: {
    status?: string;
  };
}>;

export default async function BuyerOffersPage({ searchParams }: BuyerOffersPageProps) {
  const record = await requireActivatedBuyerPortalAccess();
  const allSubmissions = await getBuyerPortalOfferSubmissions(record.id);
  const allowedStatus = new Set([
    "all",
    "submitted",
    "under_review",
    "needs_follow_up",
    "approved_to_present",
    "converted_to_offer",
    "declined",
    "withdrawn",
  ]);
  const status = searchParams?.status && allowedStatus.has(searchParams.status) ? searchParams.status : "all";
  const submissions = status === "all" ? allSubmissions : allSubmissions.filter((submission) => submission.status === status);
  const counts = {
    all: allSubmissions.length,
    submitted: allSubmissions.filter((submission) => submission.status === "submitted").length,
    under_review: allSubmissions.filter((submission) => submission.status === "under_review").length,
    needs_follow_up: allSubmissions.filter((submission) => submission.status === "needs_follow_up").length,
    approved_to_present: allSubmissions.filter((submission) => submission.status === "approved_to_present").length,
    converted_to_offer: allSubmissions.filter((submission) => submission.status === "converted_to_offer").length,
    declined: allSubmissions.filter((submission) => submission.status === "declined").length,
    withdrawn: allSubmissions.filter((submission) => submission.status === "withdrawn").length,
  };

  return (
    <PortalShell
      eyebrow="Buyer portal"
      title="My offers"
      description="Your buyer-submitted offers and their controlled internal review status."
      role="buyer"
      navItems={portalNavItemsForRole("buyer")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Buyer portal"
      status={record.status}
    >
      <PageCard
        title="Offer activity"
        description="These are your own structured offer submissions. Public users cannot access this area."
      >
        <div className="flex flex-wrap items-center gap-3">
          {statusFilters.map((filter) => (
            <Link
              key={filter.value}
              href={filter.value === "all" ? "/portal/buyer/offers" : `/portal/buyer/offers?status=${filter.value}`}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                status === filter.value
                  ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
                  : "border-ink-200 bg-[rgb(var(--surface))] text-ink-700 hover:border-accent-300 hover:text-accent-700",
              ].join(" ")}
            >
              {filter.label} ({counts[filter.value as keyof typeof counts] ?? 0})
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => <BuyerOfferActivityCard key={submission.id} record={submission} />)
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
              No offer submissions match the current filter.
            </div>
          )}
        </div>
      </PageCard>
    </PortalShell>
  );
}

const statusFilters = [
  { label: "All offers", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under review", value: "under_review" },
  { label: "Needs follow-up", value: "needs_follow_up" },
  { label: "Presented", value: "approved_to_present" },
  { label: "Converted", value: "converted_to_offer" },
  { label: "Declined", value: "declined" },
  { label: "Withdrawn", value: "withdrawn" },
] as const;
