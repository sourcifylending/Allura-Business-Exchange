import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ApplicationQueueCard } from "@/components/application-queue-card";
import { ApplicationStatusTabs } from "@/components/application-status-tabs";
import { PageCard } from "@/components/page-card";
import {
  applicationStatusOrder,
  countApplicationsByStatus,
  filterApplications,
  getSellerApplicationRecords,
} from "@/lib/application-review";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

type SellerApplicationsPageProps = Readonly<{
  searchParams?: {
    status?: string;
  };
}>;

function parseStatus(status: string | undefined): ApplicationStatus | "all" {
  if (!status || status === "all") {
    return "all";
  }

  return applicationStatusOrder.includes(status as ApplicationStatus) ? (status as ApplicationStatus) : "all";
}

export default async function SellerApplicationsPage({ searchParams }: SellerApplicationsPageProps) {
  const records = await getSellerApplicationRecords();
  const activeStatus = parseStatus(searchParams?.status);
  const filteredRecords = filterApplications(records, activeStatus);
  const counts = countApplicationsByStatus(records);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Seller applications"
        description="Internal review queue for seller submissions. Public users can only submit; they cannot activate accounts directly."
      />

      <PageCard
        title="Seller queue controls"
        description="Filter by status, review the summary fields, and open a record for approval or invite."
      >
        <ApplicationStatusTabs
          baseHref="/admin/applications/sellers"
          activeStatus={activeStatus}
          counts={counts}
          totalCount={records.length}
        />
      </PageCard>

      {filteredRecords.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredRecords.map((record) => (
            <ApplicationQueueCard
              key={record.id}
              href={`/admin/applications/sellers/${record.id}`}
              title={record.applicant_name}
              subtitle={`${record.business_name} · ${record.industry}`}
              email={record.email}
              phone={record.phone}
              status={record.status}
              createdAt={record.created_at}
              summaryItems={[
                { label: "Asset type", value: record.asset_type },
                { label: "Asking range", value: record.asking_price_range },
                { label: "Website", value: record.website || "Not provided" },
                { label: "Summary", value: record.summary.slice(0, 80) || "Review" },
              ]}
            />
          ))}
        </div>
      ) : (
        <PageCard
          title="No seller applications"
          description="When a public seller submits an application, it will appear in this queue."
        >
          <div className="rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-600">
            No records match the selected filter.
          </div>
        </PageCard>
      )}

      <div className="text-sm leading-6 text-ink-600">
        <Link href="/admin/applications" className="font-semibold text-accent-700 hover:text-accent-600">
          Back to applications review
        </Link>
      </div>
    </div>
  );
}
