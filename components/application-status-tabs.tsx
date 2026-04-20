import Link from "next/link";
import { applicationStatusLabels, applicationStatusOrder } from "@/lib/application-review";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

export function ApplicationStatusTabs({
  baseHref,
  activeStatus,
  counts,
  totalCount,
}: Readonly<{
  baseHref: string;
  activeStatus: ApplicationStatus | "all";
  counts: Record<ApplicationStatus, number>;
  totalCount: number;
}>) {
  const tabs: Array<ApplicationStatus | "all"> = ["all", ...applicationStatusOrder];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((status) => {
        const href = status === "all" ? baseHref : `${baseHref}?status=${status}`;
        const label = status === "all" ? "All" : applicationStatusLabels[status];
        const count = status === "all" ? totalCount : counts[status];
        const active = activeStatus === status;

        return (
          <Link
            key={status}
            href={href}
            className={[
              "rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase transition",
              active
                ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
                : "border-ink-200 bg-[rgb(var(--surface))] text-ink-600 hover:border-accent-200 hover:text-accent-700",
            ].join(" ")}
          >
            {label} <span className="ml-1.5 text-[10px]">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
