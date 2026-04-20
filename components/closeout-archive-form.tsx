import { archiveTransferAction, type TransferRecord } from "@/lib/closeout-ops";

export function CloseoutArchiveForm({
  transfer,
  returnTo,
}: Readonly<{
  transfer: TransferRecord;
  returnTo: string;
}>) {
  if (transfer.archived_at) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-4 py-3 text-sm font-medium text-emerald-700">
        This transfer is already archived.
      </div>
    );
  }

  return (
    <form action={archiveTransferAction} className="grid gap-4">
      <input type="hidden" name="id" value={transfer.id} />
      <input type="hidden" name="return_to" value={returnTo} />
      <p className="text-sm leading-6 text-ink-600">
        Archive the transfer once closeout is complete. This keeps it visible in the admin archive without exposing raw workflow notes to portal users.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-5 py-3 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Archive completed deal
        </button>
        <span className="text-xs font-medium tracking-[0.18em] text-ink-500 uppercase">Admin only</span>
      </div>
    </form>
  );
}
