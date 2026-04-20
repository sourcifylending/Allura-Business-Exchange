import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin-page-header";
import { SellerApplicationReviewPanel } from "@/components/seller-application-review-panel";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import { getApplicationHistoryEvents } from "@/lib/history";
import { getSellerApplicationRecord } from "@/lib/application-review";

type SellerApplicationDetailPageProps = Readonly<{
  params: {
    id: string;
  };
  searchParams?: {
    saved?: string;
    invited?: string;
    document_saved?: string;
    error?: string;
  };
}>;

export default async function SellerApplicationDetailPage({
  params,
  searchParams,
}: SellerApplicationDetailPageProps) {
  const record = await getSellerApplicationRecord(params.id);

  if (!record) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Seller application review"
        description="Review, approve, reject, and invite approved seller applicants from this private admin view."
      />

      {searchParams?.saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Seller application {searchParams.saved.replaceAll("_", " ")} successfully.
        </div>
      ) : null}
      {searchParams?.invited ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Invite sent. The application is now marked as invited.
        </div>
      ) : null}
      {searchParams?.document_saved ? (
        <div className="rounded-[1.5rem] border border-accent-200 bg-[rgb(var(--accent-soft))] px-5 py-4 text-sm font-medium text-accent-800">
          Seller document review saved successfully.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
          {searchParams.error}
        </div>
      ) : null}

      <SellerApplicationReviewPanel record={record} />

      <PageCard title="History" description="Derived application activity with safe timestamps and event labels.">
        <HistoryFeed events={await getApplicationHistoryEvents("seller", record.id)} compact />
      </PageCard>
    </div>
  );
}
