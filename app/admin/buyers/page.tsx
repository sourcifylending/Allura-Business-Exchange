import { AdminPageHeader } from "@/components/admin-page-header";
import { BuyerCard } from "@/components/buyer-card";
import { BuyerStageBoard } from "@/components/buyer-stage-board";
import { SalesOpsSummary } from "@/components/sales-ops-summary";
import { SectionHeading } from "@/components/section-heading";
import { buyerRecords, inquiryRecords } from "@/lib/buyer-ops";

export default function BuyersPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Buyers"
        description="Buyer profile and qualification shell for the internal sales workflow."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <BuyerCard buyer={buyerRecords[0]} />
        <SalesOpsSummary buyers={buyerRecords} inquiries={inquiryRecords} />
      </div>

      <section className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
        <SectionHeading
          eyebrow="Buyer Profiles"
          title="Who is real, who is qualified, and who needs action"
          description="The buyer view is designed to surface budget, proof of funds, intent, and next action at a glance."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          {buyerRecords.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      </section>

      <BuyerStageBoard
        title="Buyer stage board"
        description="A visual status view for moving buyers from new to qualified, active, watching, and closed."
        records={buyerRecords}
      />
    </div>
  );
}
