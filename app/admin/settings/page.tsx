import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Settings"
        description="Global configuration shell for the internal portal in later phases."
      />
      <PageCard title="Settings placeholder" description="No configuration logic yet." />
    </div>
  );
}
