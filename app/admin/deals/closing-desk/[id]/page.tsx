import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import {
  closingStatusLabels,
  closingStatusOrder,
  checklistStatusLabels,
  getAssetClosingById,
  saveClosingStateAction,
  updateChecklistItemAction,
} from "@/lib/closing-ops";
import { getOfferHistoryEvents } from "@/lib/history";
import type {
  AssetClosingPaymentStatus,
  AssetClosingPurchaseAgreementStatus,
  AssetClosingStatus,
  AssetClosingTransferStatus,
} from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

type AdminClosingDeskDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    error?: string;
  };
}>;

type StageAction = Readonly<{
  label: string;
  closingStatus: AssetClosingStatus;
  purchaseAgreementStatus?: AssetClosingPurchaseAgreementStatus;
  paymentStatus?: AssetClosingPaymentStatus;
  transferStatus?: AssetClosingTransferStatus;
}>;

const stageActions: StageAction[] = [
  { label: "Send Purchase Agreement", closingStatus: "pa_sent", purchaseAgreementStatus: "sent" },
  { label: "Mark Purchase Agreement Signed", closingStatus: "pa_signed", purchaseAgreementStatus: "signed" },
  { label: "Mark Awaiting Payment", closingStatus: "awaiting_payment", paymentStatus: "awaiting_payment" },
  { label: "Mark Payment Received", closingStatus: "payment_received", paymentStatus: "payment_received" },
  { label: "Start Asset Transfer", closingStatus: "transfer_in_progress", transferStatus: "in_progress" },
  { label: "Mark Transfer Complete", closingStatus: "transfer_complete", transferStatus: "complete" },
  { label: "Close Deal", closingStatus: "closed", transferStatus: "complete" },
] as const;

export default async function AdminClosingDeskDetailPage({ params, searchParams }: AdminClosingDeskDetailPageProps) {
  const closing = await getAssetClosingById(params.id);

  if (!closing) {
    redirect("/admin/deals/closing-desk?error=Closing%20not%20found.");
  }

  const buyerChecklist = closing.checklist_items.filter((item) => item.is_buyer_visible);
  const internalChecklist = closing.checklist_items.filter((item) => !item.is_buyer_visible);
  const stageIndex = closingStatusOrder.indexOf(closing.closing_status);
  const visibleStageActions = stageActions.filter((action) => closingStatusOrder.indexOf(action.closingStatus) >= stageIndex);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Closing Desk"
        description="Manual closing control for purchase agreement, payment, transfer checklist, and closure."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Closing updated successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PageCard title="Closing status" description="Move the closing forward only when the corresponding step is complete.">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">{closing.asset_name}</div>
                <div className="mt-1 text-sm leading-6 text-ink-600">
                  Buyer: {closing.buyer_name} {closing.buyer_email ? `• ${closing.buyer_email}` : ""}
                </div>
              </div>
              <div className="grid justify-items-end gap-2">
                <Badge label={closingStatusLabels[closing.closing_status]} tone={closing.closing_status === "closed" ? "emerald" : "default"} />
                <Badge label={closing.buyer_visible_status} tone="muted" />
              </div>
            </div>

            <ProgressTracker currentIndex={stageIndex} />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Info label="Purchase agreement" value={closing.purchase_agreement_status.replaceAll("_", " ")} />
              <Info label="Payment" value={closing.payment_status.replaceAll("_", " ")} />
              <Info label="Transfer" value={closing.transfer_status.replaceAll("_", " ")} />
              <Info label="Checklist" value={`${closing.checklist_complete}/${closing.checklist_total}`} />
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-5 text-sm leading-6 text-ink-700">
              <div>Buyer-visible status: {closing.buyer_visible_status}</div>
              <div>Accepted offer amount: {closing.accepted_offer_amount || "Not set"}</div>
              <div>Asset packaging: {closing.asset_packaging_id || "Not linked"}</div>
              <div>Asset registry: {closing.asset_registry_id || "Not linked"}</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/deals/closing-desk"
                className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                Back to closing desk
              </Link>
              {closing.buyer_offer_submission_id ? (
                <Link
                  href={`/admin/deals/buyer-offers/${closing.buyer_offer_submission_id}`}
                  className="rounded-full border border-accent-200 bg-[rgba(160,120,50,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                >
                  Open linked buyer offer
                </Link>
              ) : null}
            </div>
          </div>
        </PageCard>

        <PageCard title="Stage controls" description="Each button advances the closing to the named stage.">
          <div className="grid gap-3">
            {visibleStageActions.map((action) => (
              <form key={action.label} action={saveClosingStateAction} className="grid gap-2">
                <input type="hidden" name="id" value={closing.id} />
                <input type="hidden" name="return_to" value={`/admin/deals/closing-desk/${closing.id}?saved=updated`} />
                <input type="hidden" name="closing_status" value={action.closingStatus} />
                {action.purchaseAgreementStatus ? (
                  <input type="hidden" name="purchase_agreement_status" value={action.purchaseAgreementStatus} />
                ) : null}
                {action.paymentStatus ? <input type="hidden" name="payment_status" value={action.paymentStatus} /> : null}
                {action.transferStatus ? <input type="hidden" name="transfer_status" value={action.transferStatus} /> : null}
                <button
                  type="submit"
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    action.closingStatus === closing.closing_status
                      ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
                      : "border-accent-200 bg-[rgba(160,120,50,0.96)] text-accent-700 hover:border-accent-300 hover:text-accent-600",
                  ].join(" ")}
                >
                  {action.label}
                </button>
              </form>
            ))}
          </div>
        </PageCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PageCard title="Internal closing notes" description="Internal-only notes stay hidden from the buyer portal.">
          <form action={saveClosingStateAction} className="grid gap-4">
            <input type="hidden" name="id" value={closing.id} />
            <input type="hidden" name="return_to" value={`/admin/deals/closing-desk/${closing.id}?saved=updated`} />
            <input type="hidden" name="closing_status" value={closing.closing_status} />
            <input type="hidden" name="purchase_agreement_status" value={closing.purchase_agreement_status} />
            <input type="hidden" name="payment_status" value={closing.payment_status} />
            <input type="hidden" name="transfer_status" value={closing.transfer_status} />
            <label className="grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Internal notes</span>
              <textarea
                name="internal_notes"
                defaultValue={closing.internal_notes}
                rows={6}
                className={inputClass}
                placeholder="Internal-only transfer notes. Do not include credentials or keys."
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-accent-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              Save notes
            </button>
          </form>
        </PageCard>

        <PageCard title="Buyer-visible checklist" description="This preview only shows items the buyer can safely see.">
          <div className="grid gap-3">
            {buyerChecklist.length > 0 ? (
              buyerChecklist.map((item) => (
                <div key={item.id} className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4 text-sm leading-6 text-ink-700">
                  <div className="font-semibold text-ink-950">{item.buyer_visible_label || item.label}</div>
                  <div className="mt-1 text-ink-600">Status: {checklistStatusLabels[item.status]}</div>
                  <div className="mt-1 text-ink-500">{item.completed_at ? new Date(item.completed_at).toLocaleString() : "Not completed yet"}</div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
                No buyer-visible checklist items have been marked yet.
              </div>
            )}
          </div>
        </PageCard>
      </div>

      <PageCard title="Asset transfer checklist" description="Update each checklist item one by one and add internal notes as needed.">
        <div className="grid gap-4">
          {internalChecklist.concat(buyerChecklist).length > 0 ? (
            internalChecklist.concat(buyerChecklist).map((item) => (
              <form
                key={item.id}
                action={updateChecklistItemAction}
                className="grid gap-4 rounded-[1.5rem] border border-ink-200 bg-[rgb(var(--surface))] p-4"
              >
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="asset_closing_id" value={closing.id} />
                <input type="hidden" name="return_to" value={`/admin/deals/closing-desk/${closing.id}?saved=updated`} />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <div className="text-sm font-semibold text-ink-950">{item.label}</div>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
                      {item.is_buyer_visible ? "Buyer visible" : "Admin only"}
                    </div>
                  </div>
                  <div className="rounded-full border border-ink-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700">
                    {checklistStatusLabels[item.status]}
                  </div>
                </div>

                {item.is_buyer_visible ? (
                  <div className="rounded-2xl border border-emerald-200 bg-[rgba(12,35,22,0.06)] px-4 py-3 text-sm text-emerald-800">
                    Buyer label: {item.buyer_visible_label || item.label}
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="grid gap-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Status</span>
                    <select name="status" defaultValue={item.status} className={inputClass}>
                      {Object.entries(checklistStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">Internal notes</span>
                    <input type="text" name="internal_notes" defaultValue={item.internal_notes} className={inputClass} />
                  </label>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="rounded-full border border-accent-200 bg-[rgba(160,120,50,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
                    >
                      Save item
                    </button>
                  </div>
                </div>
              </form>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
              No checklist items are attached to this closing yet.
            </div>
          )}
        </div>
      </PageCard>

      <PageCard title="History" description="Derived closing activity with safe timestamps and event labels.">
        <HistoryFeed events={await getOfferHistoryEvents("admin", closing.related_offer?.id ?? closing.id)} compact />
      </PageCard>
    </div>
  );
}

function ProgressTracker({
  currentIndex,
}: Readonly<{
  currentIndex: number;
}>) {
  return (
    <div className="grid gap-2">
      {closingStatusOrder.map((status, index) => {
        const state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "pending";
        const stateClass =
          state === "complete"
            ? "border-emerald-200 bg-[rgba(12,35,22,0.06)] text-emerald-800"
            : state === "current"
              ? "border-accent-200 bg-[rgba(160,120,50,0.12)] text-accent-800"
              : "border-ink-200 bg-[rgb(var(--surface))] text-ink-600";

        return (
          <div key={status} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${stateClass}`}>
            {index + 1}. {closingStatusLabels[status]}
          </div>
        );
      })}
    </div>
  );
}

function Badge({
  label,
  tone = "default",
}: Readonly<{
  label: string;
  tone?: "default" | "muted" | "emerald";
}>) {
  const className =
    tone === "emerald"
      ? "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700"
      : tone === "muted"
        ? "border-ink-200 bg-[rgb(var(--surface))] text-ink-700"
        : "border-accent-200 bg-[rgba(160,120,50,0.96)] text-accent-700";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${className}`}>
      {label}
    </span>
  );
}

function Info({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200";
