import { applicationStatusLabels } from "@/lib/application-review";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const statusClasses: Record<ApplicationStatus, string> = {
  submitted: "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700",
  under_review: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  approved: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  rejected: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
  invited: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  activated: "border-violet-200 bg-[rgba(33,22,52,0.96)] text-violet-700",
};

export function ApplicationStatusPill({
  status,
}: Readonly<{
  status: ApplicationStatus;
}>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
        statusClasses[status],
      ].join(" ")}
    >
      {applicationStatusLabels[status]}
    </span>
  );
}
