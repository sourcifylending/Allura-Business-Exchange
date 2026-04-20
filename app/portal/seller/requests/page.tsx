import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { RequestCard } from "@/components/request-card";
import { getSellerPortalRequests, portalRequestSummaryCount } from "@/lib/portal-requests";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type SellerRequestsPageProps = Readonly<{
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

export default async function SellerRequestsPage({ searchParams }: SellerRequestsPageProps) {
  const record = await requireSellerPortalAccess();
  const requests = record.status === "activated" ? await getSellerPortalRequests(record.id) : [];
  const counts = portalRequestSummaryCount(requests);

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller requests"
      description="Controlled action items and document requests assigned to this seller account."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Request updated successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <PageCard title="Request summary" description="Track open, overdue, and completed seller action items.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Open" value={counts.open} />
          <Stat label="Overdue" value={counts.overdue} />
          <Stat label="Completed" value={counts.completed} />
        </div>
      </PageCard>

      <PageCard title="Action items" description="Seller-owned requests appear here with portal-safe instructions only.">
        {requests.length > 0 ? (
          <div className="grid gap-5">
            {requests.map((request) => (
              <RequestCard key={request.id} record={request} href={`/portal/seller/requests/${request.id}`} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5">
            <div className="text-sm font-semibold text-ink-900">No seller requests yet</div>
            <div className="mt-1 text-sm leading-6 text-ink-600">
              Admin-assigned requests will appear here once the portal chain requires action.
            </div>
          </div>
        )}
      </PageCard>
    </PortalShell>
  );
}

function Stat({
  label,
  value,
}: Readonly<{
  label: string;
  value: number;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}
