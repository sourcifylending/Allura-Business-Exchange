import type { ApplicationDocumentStatus } from "@/lib/supabase/database.types";

const statusStyles: Record<ApplicationDocumentStatus, string> = {
  uploaded: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  received: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  under_review: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  approved: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  rejected: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
};

export function ApplicationDocumentStatusPill({
  status,
}: Readonly<{
  status: ApplicationDocumentStatus;
}>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${statusStyles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
