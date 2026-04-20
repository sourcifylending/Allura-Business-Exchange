import { AdminPageHeader } from "@/components/admin-page-header";
import { BuyerFormFields } from "@/components/buyer-form-fields";
import { BuyerCard } from "@/components/buyer-card";
import { BuyerStageBoard } from "@/components/buyer-stage-board";
import { SectionHeading } from "@/components/section-heading";
import { SalesOpsSummary } from "@/components/sales-ops-summary";
import { createBuyerRecord, getBuyerRecords, getInquiryRecords } from "@/lib/buyer-ops";

type BuyersPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const [buyerRecords, inquiryRecords] = await Promise.all([getBuyerRecords(), getInquiryRecords()]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyers"
        description="Buyer profile and qualification shell for the internal sales workflow."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Buyer {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}
      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Buyer"
          title="Capture a new buyer profile"
          description="Add the core qualification details now so the buyer can move through discovery, qualification, and active stages without rework."
        />
        <form action={createBuyerRecord} className="grid gap-5">
          <BuyerFormFields submitLabel="Create buyer" />
        </form>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {buyerRecords[0] ? (
          <BuyerCard buyer={buyerRecords[0]} editable />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Buyer Profiles
            </div>
            <div className="text-xl font-semibold text-ink-950">No buyers yet</div>
            <p>
              Add rows to the Supabase <code>buyers</code> table to populate this shell.
            </p>
          </section>
        )}
        <SalesOpsSummary buyers={buyerRecords} inquiries={inquiryRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Buyer Profiles"
          title="Who is real, who is qualified, and who needs action"
          description="The buyer view is designed to surface budget, proof of funds, intent, and next action at a glance."
        />
        {buyerRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {buyerRecords.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} editable />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No buyer records are loaded yet. Once rows exist in Supabase, the buyer cards will
            appear here automatically.
          </div>
        )}
      </section>

      <BuyerStageBoard
        title="Buyer stage board"
        description="A visual status view for moving buyers from new to qualified, active, watching, and closed."
        records={buyerRecords}
        editable
      />
    </div>
  );
}
