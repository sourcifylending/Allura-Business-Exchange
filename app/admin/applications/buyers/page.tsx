import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { ApplicationQueueCard } from "@/components/application-queue-card";
import { ApplicationStatusTabs } from "@/components/application-status-tabs";
import { PageCard } from "@/components/page-card";
import {
  applicationStatusOrder,
  countApplicationsByStatus,
  filterApplications,
  getBuyerApplicationRecords,
} from "@/lib/application-review";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

type BuyerApplicationsPageProps = Readonly<{
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

export default async function BuyerApplicationsPage({ searchParams }: BuyerApplicationsPageProps) {
  const records = await getBuyerApplicationRecords();
  const activeStatus = parseStatus(searchParams?.status);
  const filteredRecords = filterApplications(records, activeStatus);
  const counts = countApplicationsByStatus(records);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyer applications"
        description="Internal review queue for buyer submissions. Public users can only submit; they cannot read or activate accounts."
      />

      <PageCard
        title="Buyer queue controls"
        description="Filter by status, review the summary fields, and open a record for approval or invite."
      >
        <ApplicationStatusTabs
          baseHref="/admin/applications/buyers"
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
              href={`/admin/applications/buyers/${record.id}`}
              title={record.applicant_name}
              subtitle={`${record.buyer_type} · ${record.budget_range}`}
              email={record.email}
              phone={record.phone}
              status={record.status}
              createdAt={record.created_at}
              summaryItems={[
                { label: "Urgency", value: record.urgency },
                { label: "Proof of funds", value: record.proof_of_funds_status },
                { label: "Niches", value: record.niches_of_interest.join(", ") || "None" },
                { label: "Message", value: record.message.slice(0, 80) || "Review" },
              ]}
            />
          ))}
        </div>
      ) : (
        <PageCard
          title="No buyer applications"
          description="When a public buyer submits an application, it will appear in this queue."
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
