import type { ApplicationStatus } from "@/lib/supabase/database.types";
import { applicationStatusLabels, applicationStatusOrder } from "@/lib/application-review";

export function ApplicationReviewActions({
  recordId,
  status,
  adminNotes,
  saveAction,
  markUnderReviewAction,
  approveAction,
  rejectAction,
  inviteAction,
  inviteDisabled = false,
  inviteDisabledLabel = "Invite is available only after approval.",
}: Readonly<{
  recordId: string;
  status: ApplicationStatus;
  adminNotes: string;
  saveAction: (formData: FormData) => void | Promise<void>;
  markUnderReviewAction: (formData: FormData) => void | Promise<void>;
  approveAction: (formData: FormData) => void | Promise<void>;
  rejectAction: (formData: FormData) => void | Promise<void>;
  inviteAction: (formData: FormData) => void | Promise<void>;
  inviteDisabled?: boolean;
  inviteDisabledLabel?: string;
}>) {
  return (
    <form action={saveAction} className="grid gap-5">
      <input type="hidden" name="id" value={recordId} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
            Status
          </span>
          <select
            name="status"
            defaultValue={status}
            className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
          >
            {applicationStatusOrder.map((option) => (
              <option key={option} value={option}>
                {applicationStatusLabels[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
            Admin notes
          </span>
          <textarea
            name="admin_notes"
            rows={4}
            defaultValue={adminNotes}
            className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-accent-400"
            placeholder="Add review notes, invite context, or rejection reasoning."
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton label="Save review" />
        <ActionButton label="Mark under review" formAction={markUnderReviewAction} />
        <ActionButton label="Approve" formAction={approveAction} />
        <ActionButton label="Reject" formAction={rejectAction} />
        {!inviteDisabled ? <ActionButton label="Send invite" formAction={inviteAction} /> : null}
      </div>

      {inviteDisabled ? (
        <p className="text-sm leading-6 text-ink-500">{inviteDisabledLabel}</p>
      ) : (
        <p className="text-sm leading-6 text-ink-500">
          Invite is server-side only and only works after approval.
        </p>
      )}
    </form>
  );
}

function ActionButton({
  label,
  formAction,
}: Readonly<{
  label: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}>) {
  const className =
    "rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700";

  return formAction ? (
    <button type="submit" formAction={formAction} className={className}>
      {label}
    </button>
  ) : (
    <button type="submit" className={className}>
      {label}
    </button>
  );
}
