import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function DocumentsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Documents"
        description="Storage and reference shell for later document organization."
      />
      <PageCard title="Document library placeholder" description="No file handling logic yet." />
    </div>
  );
}
