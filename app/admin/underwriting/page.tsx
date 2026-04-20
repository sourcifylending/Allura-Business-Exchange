import { AdminPageHeader } from "@/components/admin-page-header";
import { BusinessUnderwritingFormFields } from "@/components/business-underwriting-form-fields";
import { UnderwritingCard } from "@/components/underwriting-card";
import { UnderwritingSummary } from "@/components/underwriting-summary";
import { UnderwritingWorkflowBoard } from "@/components/underwriting-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { createUnderwritingRecord, getUnderwritingRecords } from "@/lib/business-underwriting";

type UnderwritingPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function UnderwritingPage({ searchParams }: UnderwritingPageProps) {
  const underwritingRecords = await getUnderwritingRecords();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Underwriting"
        description="Internal evaluation shell for business quality, transferability, and spread potential."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Underwriting record {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}
      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Underwriting"
          title="Capture a new business opportunity"
          description="Add the core deal-quality fields now so the record can move through screening, review, and approval with less rework."
        />
        <form action={createUnderwritingRecord} className="grid gap-5">
          <BusinessUnderwritingFormFields submitLabel="Create underwriting" />
        </form>
      </section>
      {underwritingRecords.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <UnderwritingCard record={underwritingRecords[0]} />
          <UnderwritingSummary records={underwritingRecords} />
        </div>
      ) : (
        <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Underwriting
          </div>
          <div className="text-xl font-semibold text-ink-950">No underwriting rows yet</div>
          <p>
            Add records to the Supabase <code>business_underwriting</code> table to populate this
            shell with risk, transferability, and spread data.
          </p>
        </section>
      )}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Underwriting Overview"
          title="Deal quality, transferability, and risk first"
          description="The goal is to surface debt, owner dependence, margin quality, and spread potential before any later buyer presentation work."
        />
        {underwritingRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {underwritingRecords.map((record) => (
              <UnderwritingCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No underwriting records are loaded yet. Once rows exist in Supabase, the underwriting
            cards will appear here automatically.
          </div>
        )}
      </section>

      <UnderwritingWorkflowBoard
        title="Underwriting workflow"
        description="A stage-oriented view for screening, reviewing, holding, approving, or rejecting business opportunities."
        records={underwritingRecords}
      />
    </div>
  );
}
