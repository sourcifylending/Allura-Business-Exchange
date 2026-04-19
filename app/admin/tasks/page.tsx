import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";

export default function TasksPage() {
  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Tasks"
        description="Lightweight operations shell for future internal task management."
      />
      <PageCard title="Task list placeholder" description="No task engine yet." />
    </div>
  );
}
