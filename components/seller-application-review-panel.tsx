import Link from "next/link";
import { ApplicationReviewActions } from "@/components/application-review-actions";
import { ApplicationDocumentReviewSection } from "@/components/application-document-review-section";
import { ApplicationStatusPill } from "@/components/application-status-pill";
import { PageCard } from "@/components/page-card";
import {
  approveSellerApplication,
  formatApplicationDate,
  inviteSellerApplication,
  markSellerApplicationUnderReview,
  rejectSellerApplication,
  saveSellerApplicationReview,
} from "@/lib/application-review";
import { getAdminApplicationDocuments } from "@/lib/application-documents";
import type { SellerApplicationRow } from "@/lib/supabase/database.types";

export async function SellerApplicationReviewPanel({
  record,
}: Readonly<{
  record: SellerApplicationRow;
}>) {
  const documents = await getAdminApplicationDocuments("seller", record.id);

  return (
    <div className="grid gap-6">
      <PageCard title={record.applicant_name} description="Seller application detail and review controls.">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-1 text-sm text-ink-600">
            <div>
              <span className="font-semibold text-ink-900">Email:</span> {record.email}
            </div>
            <div>
              <span className="font-semibold text-ink-900">Phone:</span> {record.phone}
            </div>
            <div>
              <span className="font-semibold text-ink-900">Website:</span> {record.website || "Not provided"}
            </div>
          </div>
          <ApplicationStatusPill status={record.status} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Business name" value={record.business_name} />
          <Field label="Industry" value={record.industry} />
          <Field label="Asset type" value={record.asset_type} />
          <Field label="Asking range" value={record.asking_price_range} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ListField label="Summary" value={record.summary} />
          <ListField label="Reason for selling" value={record.reason_for_selling} />
        </div>
      </PageCard>

      <PageCard title="Review and invite" description="Admin-only review controls and audit trail.">
        <ApplicationReviewActions
          recordId={record.id}
          status={record.status}
          adminNotes={record.admin_notes}
          saveAction={saveSellerApplicationReview}
          markUnderReviewAction={markSellerApplicationUnderReview}
          approveAction={approveSellerApplication}
          rejectAction={rejectSellerApplication}
          inviteAction={inviteSellerApplication}
          inviteDisabled={record.status !== "approved"}
          inviteDisabledLabel={
            record.status === "invited"
              ? "Invite already sent."
              : record.status === "activated"
                ? "This application has already been activated."
                : "Invite is available only after approval."
          }
        />
      </PageCard>

      <PageCard title="Audit trail" description="Internal timestamps for review and invite history.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Created at" value={formatApplicationDate(record.created_at)} />
          <Field label="Reviewed at" value={formatApplicationDate(record.reviewed_at)} />
          <Field label="Invited at" value={formatApplicationDate(record.invited_at)} />
          <Field label="Reviewed by" value={record.reviewed_by ?? "Not set"} />
          <Field label="Invited by" value={record.invited_by ?? "Not set"} />
          <Field label="Linked user" value={record.linked_user_id ?? "Not set"} />
        </div>
        <div className="mt-4 text-sm leading-6 text-ink-600">
          <Link href="/admin/applications/sellers" className="font-semibold text-accent-700 hover:text-accent-600">
            Back to the seller queue
          </Link>
        </div>
      </PageCard>

      <ApplicationDocumentReviewSection role="seller" applicationId={record.id} documents={documents} />
    </div>
  );
}

function Field({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function ListField({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value || "None"}</div>
    </div>
  );
}
