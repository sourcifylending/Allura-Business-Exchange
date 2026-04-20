import { ApplicationDocumentList } from "@/components/application-document-list";
import { ApplicationDocumentUploadForm } from "@/components/application-document-upload-form";
import { PageCard } from "@/components/page-card";
import { PortalShell } from "@/components/portal-shell";
import { portalDocumentOptions } from "@/lib/application-documents";
import { getSellerApplicationDocuments, uploadSellerApplicationDocument } from "@/lib/application-documents";
import { portalNavItemsForRole } from "@/lib/portal-navigation";
import { requireSellerPortalAccess } from "@/lib/portal-access";

export const dynamic = "force-dynamic";

type SellerDocumentsPageProps = Readonly<{
  searchParams?: {
    uploaded?: string;
    error?: string;
  };
}>;

export default async function SellerDocumentsPage({ searchParams }: SellerDocumentsPageProps) {
  const record = await requireSellerPortalAccess();
  const documents = await getSellerApplicationDocuments();

  return (
    <PortalShell
      eyebrow="Seller portal"
      title="Seller documents"
      description="Controlled document room for invited seller users."
      role="seller"
      navItems={portalNavItemsForRole("seller")}
      accountName={record.applicant_name}
      accountEmail={record.email}
      accountType="Seller portal"
      status={record.status}
    >
      {searchParams?.uploaded ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-[rgba(12,35,22,0.96)] px-5 py-4 text-sm font-medium text-emerald-700">
          Seller document uploaded successfully.
        </div>
      ) : null}

      {searchParams?.error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-[rgba(52,18,26,0.96)] px-5 py-4 text-sm font-medium text-rose-700">
          {searchParams.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <ApplicationDocumentUploadForm
          title="Upload a document"
          description="Add financials, tax returns, bank statements, a business summary, or another controlled file."
          action={uploadSellerApplicationDocument}
          documentTypes={portalDocumentOptions("seller")}
          buttonLabel="Upload seller document"
          helperText="Files stay private and are reviewed only through the portal workflow."
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
        />

        <PageCard title="Document room notes" description="Controlled access remains role-safe and private.">
          <div className="grid gap-3 text-sm leading-6 text-ink-700">
            <div>Only your linked seller application can see these files.</div>
            <div>No public URLs are exposed.</div>
            <div>View and download are issued through short-lived signed access.</div>
          </div>
        </PageCard>
      </div>

      <ApplicationDocumentList
        role="seller"
        title="Uploaded seller documents"
        description="Files submitted through the portal appear here with their current review status."
        documents={documents}
        emptyStateTitle="No seller documents uploaded yet"
        emptyStateDescription="Upload your first controlled document to begin the document room workflow."
      />
    </PortalShell>
  );
}
