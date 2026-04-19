import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function ListingsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="AI Asset Listings"
        description="Publication shell for sale-ready AI assets and controlled listing visibility."
      />
      <PageCard
        title="Listing queue"
        description="Public listing cards and status controls will be added later."
      />
    </div>
  );
}
