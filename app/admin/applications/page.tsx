import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import {
  applicationStatusLabels,
  applicationStatusOrder,
  countApplicationsByStatus,
  getBuyerApplicationRecords,
  getSellerApplicationRecords,
} from "@/lib/application-review";

export default async function ApplicationsReviewPage() {
  const [buyerApplications, sellerApplications] = await Promise.all([
    getBuyerApplicationRecords(),
    getSellerApplicationRecords(),
  ]);

  const buyerCounts = countApplicationsByStatus(buyerApplications);
  const sellerCounts = countApplicationsByStatus(sellerApplications);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Applications Review"
        description="Approval-first buyer and seller applications stay separate from active portal users until the admin team invites them."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <QueueCard
          title="Buyer applications"
          href="/admin/applications/buyers"
          description="Review prospective buyers, their budgets, niche interests, and proof-of-funds status."
          counts={buyerCounts}
          totalCount={buyerApplications.length}
        />
        <QueueCard
          title="Seller applications"
          href="/admin/applications/sellers"
          description="Review seller submissions before any invite or activation path is allowed."
          counts={sellerCounts}
          totalCount={sellerApplications.length}
        />
      </div>

      <PageCard
        title="Document queue"
        description="Review uploaded portal files across buyer and seller applications with secure signed access."
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm leading-6 text-ink-600">
            Open the central queue to filter portal documents by application type, status, and category.
          </div>
          <Link
            href="/admin/applications/documents"
            className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
          >
            Open document queue
          </Link>
        </div>
      </PageCard>

      <PageCard
        title="Buyer interest queue"
        description="Review buyer portal interest and watchlist activity in one controlled admin surface."
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm leading-6 text-ink-600">
            Open the buyer interest queue to scan who has expressed interest or saved a visible opportunity.
          </div>
          <Link
            href="/admin/buyer-interest"
            className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
          >
            Open buyer interest queue
          </Link>
        </div>
      </PageCard>

      <PageCard
        title="Buyer offers queue"
        description="Review structured buyer offer intent before it is promoted into the internal offer pipeline."
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm leading-6 text-ink-600">
            Open the buyer offer queue to review proposed price, structure preference, financing plan, and target close date.
          </div>
          <Link
            href="/admin/buyer-offers"
            className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
          >
            Open buyer offers queue
          </Link>
        </div>
      </PageCard>

      <PageCard
        title="Workflow rules"
        description="Applications are insert-only on the public side, hidden from public read access, and reviewed by admin only."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {applicationStatusOrder.map((status) => (
            <div key={status} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                {applicationStatusLabels[status]}
              </div>
              <div className="mt-1 text-sm leading-6 text-ink-700">
                {status === "submitted"
                  ? "New public submission"
                  : status === "under_review"
                    ? "Internal review in progress"
                    : status === "approved"
                      ? "Approved for invite"
                      : status === "invited"
                        ? "Invite sent from admin only"
                        : status === "activated"
                          ? "Reserved for future activation"
                          : "Closed without access"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-sm leading-6 text-ink-600">
          Use the queue pages to review applications. Approve only if the submission is ready for invitation,
          and keep activation reserved until the next safe phase.
        </div>
      </PageCard>
    </div>
  );
}

function QueueCard({
  title,
  href,
  description,
  counts,
  totalCount,
}: Readonly<{
  title: string;
  href: string;
  description: string;
  counts: Record<(typeof applicationStatusOrder)[number], number>;
  totalCount: number;
}>) {
  return (
    <PageCard title={title} description={description}>
      <div className="grid gap-3 md:grid-cols-2">
        {applicationStatusOrder.map((status) => (
          <div key={status} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
              {applicationStatusLabels[status]}
            </div>
            <div className="mt-1 text-2xl font-semibold text-ink-950">{counts[status]}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-sm text-ink-600">
          <span className="font-semibold text-ink-900">{totalCount}</span> total applications in this queue.
        </div>
        <Link
          href={href}
          className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Open queue
        </Link>
      </div>
    </PageCard>
  );
}
