import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { TransferCard } from "@/components/transfer-card";
import { getArchivedTransferRecords } from "@/lib/closeout-ops";

export const dynamic = "force-dynamic";

export default async function AdminCloseoutArchivePage() {
  const archivedTransfers = await getArchivedTransferRecords();

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Closeout Archive"
        description="Completed and archived transfer records, retained for admin reference only."
      />

      <PageCard title="Archive queue" description="Metadata-first archive view for completed deals.">
        {archivedTransfers.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {archivedTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} detailHref={`/admin/closeout/${transfer.id}`} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] px-5 py-6 text-sm leading-6 text-ink-600">
            No archived transfers yet.
          </div>
        )}
      </PageCard>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/closeout"
          className="rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
        >
          Back to closeout desk
        </Link>
      </div>
    </div>
  );
}
