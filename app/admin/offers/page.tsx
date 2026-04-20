import { AdminPageHeader } from "@/components/admin-page-header";
import { OfferCard } from "@/components/offer-card";
import { OfferFormFields } from "@/components/offer-form-fields";
import { CloseoutSummary } from "@/components/closeout-summary";
import { OfferWorkflowBoard } from "@/components/offer-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { createOfferRecord, getContractRecords, getOfferRecords, getTransferRecords } from "@/lib/closeout-ops";
import { getBuyerRecords } from "@/lib/buyer-ops";

type OffersPageProps = Readonly<{
  searchParams?: {
    error?: string;
    saved?: string;
  };
}>;

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const [buyerRecords, offerRecords, contractRecords, transferRecords] = await Promise.all([
    getBuyerRecords(),
    getOfferRecords(),
    getContractRecords(),
    getTransferRecords(),
  ]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Offer Desk"
        description="Internal offer management shell for tracking offers, counters, and accepted terms."
      />
      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Offer {searchParams.saved === "created" ? "created" : "updated"} successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="New Offer"
          title="Capture a buyer offer"
          description="Add the offer details now so the record can move through offered, countered, accepted, or waiting with less rework."
        />
        <form action={createOfferRecord} className="grid gap-5">
          <OfferFormFields buyerOptions={buyerRecords} submitLabel="Create offer" />
        </form>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {offerRecords[0] ? (
          <OfferCard offer={offerRecords[0]} editable buyerOptions={buyerRecords} />
        ) : (
          <section className="grid gap-4 rounded-[1.75rem] border border-dashed border-ink-200 bg-ink-50 p-6 text-sm leading-6 text-ink-600">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Offer Desk
            </div>
            <div className="text-xl font-semibold text-ink-950">No offers yet</div>
            <p>
              Add rows to the Supabase <code>offers</code> table to populate this shell.
            </p>
          </section>
        )}
        <CloseoutSummary offers={offerRecords} contracts={contractRecords} transfers={transferRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Offer Desk Overview"
          title="What is offered and what needs action"
          description="Designed to surface asking price, offer amount, accepted terms, owner, target close date, and next action."
        />
        {offerRecords.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {offerRecords.map((offer) => (
              <OfferCard key={offer.id} offer={offer} editable buyerOptions={buyerRecords} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-ink-50 px-5 py-6 text-sm leading-6 text-ink-600">
            No offer records are loaded yet. Once rows exist in Supabase, the offer cards will
            appear here automatically.
          </div>
        )}
      </section>

      <OfferWorkflowBoard
        title="Offer status board"
        description="A fast-moving view of what is offered, countered, accepted, or waiting."
        records={offerRecords}
        editable
        buyerOptions={buyerRecords}
      />
    </div>
  );
}
