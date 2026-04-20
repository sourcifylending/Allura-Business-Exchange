import { AdminPageHeader } from "@/components/admin-page-header";
import { BusinessIntakeCard } from "@/components/business-intake-card";
import { BusinessIntakeFormFields } from "@/components/business-intake-form-fields";
import { BusinessIntakeSummary } from "@/components/business-intake-summary";
import { BusinessIntakeWorkflowBoard } from "@/components/business-intake-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { createBusinessIntakeRecord, getBusinessIntakeRecords } from "@/lib/business-intake";

type BusinessSubmissionsPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function BusinessSubmissionsPage({ searchParams }: BusinessSubmissionsPageProps) {
  const businessIntakeRecords = await getBusinessIntakeRecords();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Business Intake"
        description="Internal seller intake shell for secondary-lane business opportunities and review prep."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Business intake entry {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Business Intake"
          title="Capture a new seller opportunity"
          description="Add the core seller-side details now so the intake can move into review and underwriting with less back-and-forth."
        />
        <form action={createBusinessIntakeRecord} className="grid gap-5">
          <BusinessIntakeFormFields submitLabel="Create intake" />
        </form>
      </section>

      {businessIntakeRecords.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <BusinessIntakeCard record={businessIntakeRecords[0]} />
          <BusinessIntakeSummary records={businessIntakeRecords} />
        </div>
      ) : (
        <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Seller Intake
          </div>
          <div className="text-xl font-semibold text-ink-950">No business intake rows yet</div>
          <p>
            Add records to the Supabase <code>business_intake</code> table to populate this shell
            with seller records, review status, and transferability details.
          </p>
        </section>
      )}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Seller Intake Overview"
          title="Completeness and transferability first"
          description="Designed to show financial range, reason for sale, debt disclosures, owner involvement, and transferability before underwriting."
        />
        {businessIntakeRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {businessIntakeRecords.map((record) => (
              <BusinessIntakeCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No intake records are loaded yet. Once rows exist in Supabase, the intake cards will
            appear here automatically.
          </div>
        )}
      </section>

      <BusinessIntakeWorkflowBoard
        title="Intake and review workflow"
        description="A clear internal view of what is new, in review, needs information, or complete."
        records={businessIntakeRecords}
      />
    </div>
  );
}
