import { AdminPageHeader } from "@/components/admin-page-header";
import { CloseoutSummary } from "@/components/closeout-summary";
import { OfferWorkflowBoard } from "@/components/offer-workflow-board";
import { SectionHeading } from "@/components/section-heading";
import { offerRecords } from "@/lib/closeout-ops";

export default function OffersPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Offer Desk"
        description="Internal offer management shell for tracking offers, counters, and accepted terms."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <OfferWorkflowBoard
          title="Offer status board"
          description="A fast-moving view of what is offered, countered, accepted, or waiting."
          records={offerRecords}
        />
        <CloseoutSummary offers={offerRecords} contracts={[]} transfers={[]} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Offer Desk Overview"
          title="What is offered and what needs action"
          description="Designed to surface asking price, offer amount, accepted terms, owner, target close date, and next action."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {offerRecords.map((offer) => (
            <div key={offer.id} className="rounded-[1.75rem] border border-ink-200 bg-ink-50 p-6">
              <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {offer.asset_name}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-700">{offer.buyer_name}</div>
              <div className="mt-3 text-sm leading-6 text-ink-600">
                Ask {offer.asking_price} | Offer {offer.offer_amount}
              </div>
              <div className="mt-3 text-sm leading-6 text-ink-600">{offer.next_action}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
