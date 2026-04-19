import { RadarScorePill } from "@/components/radar-score-pill";
import type { ContractRecord, OfferRecord, TransferRecord } from "@/lib/closeout-ops";

export function CloseoutSummary({
  offers,
  contracts,
  transfers,
}: Readonly<{
  offers: OfferRecord[];
  contracts: ContractRecord[];
  transfers: TransferRecord[];
}>) {
  const acceptedOffers = offers.filter((offer) => offer.stage === "accepted").length;
  const signedContracts = contracts.filter((contract) => contract.signature_status === "complete").length;
  const completedTransfers = transfers.filter((transfer) => transfer.overall_transfer_status === "complete").length;

  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        Closeout Snapshot
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <RadarScorePill label="Accepted Offers" value={acceptedOffers} tone="positive" />
        <RadarScorePill label="Signed Contracts" value={signedContracts} tone="warning" />
        <RadarScorePill label="Completed Transfers" value={completedTransfers} tone="neutral" />
      </div>
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
        Use this shell to track what is offered, signed, paid, and handed off.
      </div>
    </section>
  );
}

