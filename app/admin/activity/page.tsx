import Link from "next/link";
import { AdminPageHeader } from "@/components/admin-page-header";
import { HistoryFeed } from "@/components/history-feed";
import { PageCard } from "@/components/page-card";
import {
  filterHistoryEvents,
  getAdminActivityHistory,
  historyEntityTypeLabels,
  historyEventTypeLabels,
  historyRoleLabels,
  summarizeHistory,
  type HistoryEntityType,
  type HistoryEventType,
  type HistoryRole,
} from "@/lib/history";

export const dynamic = "force-dynamic";

type AdminActivityPageProps = Readonly<{
  searchParams?: {
    entity?: string;
    role?: string;
    event?: string;
    window?: string;
  };
}>;

function validEntity(value: string | undefined): HistoryEntityType | "all" {
  return value && value in historyEntityTypeLabels ? (value as HistoryEntityType) : "all";
}

function validRole(value: string | undefined): HistoryRole | "all" {
  return value === "admin" || value === "buyer" || value === "seller" ? value : "all";
}

function validEvent(value: string | undefined): HistoryEventType | "all" {
  return value && value in historyEventTypeLabels ? (value as HistoryEventType) : "all";
}

function validWindow(value: string | undefined): "7" | "30" | "90" | "all" {
  return value === "7" || value === "30" || value === "90" ? value : "30";
}

function buildPath(searchParams: Record<string, string | undefined>) {
  const url = new URL("/admin/activity", "http://allura.local");

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && value !== "all") {
      url.searchParams.set(key, value);
    }
  }

  return `${url.pathname}${url.search}`;
}

export default async function AdminActivityPage({ searchParams }: AdminActivityPageProps) {
  const entity = validEntity(searchParams?.entity);
  const role = validRole(searchParams?.role);
  const event = validEvent(searchParams?.event);
  const window = validWindow(searchParams?.window);
  const events = filterHistoryEvents(await getAdminActivityHistory(), {
    entity,
    role,
    event,
    window,
  });
  const summary = summarizeHistory(events);

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title="Activity"
        description="Admin audit trail across applications, requests, documents, deals, and closeout actions."
      />

      <PageCard title="Overview" description="Recent operational activity and derived audit counts.">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Total events" value={String(summary.total)} />
          <Metric label="Recent" value={String(summary.recent)} />
          <Metric label="Completed" value={String(summary.completed)} />
          <Metric label="Overdue" value={String(summary.overdue)} />
        </div>
      </PageCard>

      <PageCard title="Filters" description="Narrow the feed by entity, role, event type, and time window.">
        <div className="grid gap-5">
          <FilterRow
            label="Entity"
            currentValue={entity}
            options={[
              { label: "All", value: "all" },
              ...Object.entries(historyEntityTypeLabels).map(([value, label]) => ({ value, label })),
            ]}
            buildHref={(value) =>
              buildPath({
                entity: value,
                role,
                event,
                window,
              })
            }
          />

          <FilterRow
            label="Role"
            currentValue={role}
            options={[
              { label: "All", value: "all" },
              ...Object.entries(historyRoleLabels).map(([value, label]) => ({ value, label })),
            ]}
            buildHref={(value) =>
              buildPath({
                entity,
                role: value,
                event,
                window,
              })
            }
          />

          <FilterRow
            label="Event"
            currentValue={event}
            options={[
              { label: "All", value: "all" },
              ...Object.entries(historyEventTypeLabels).map(([value, label]) => ({ value, label })),
            ]}
            buildHref={(value) =>
              buildPath({
                entity,
                role,
                event: value,
                window,
              })
            }
          />

          <FilterRow
            label="Window"
            currentValue={window}
            options={[
              { label: "7 days", value: "7" },
              { label: "30 days", value: "30" },
              { label: "90 days", value: "90" },
              { label: "All", value: "all" },
            ]}
            buildHref={(value) =>
              buildPath({
                entity,
                role,
                event,
                window: value,
              })
            }
          />

          <Link
            href="/admin/activity"
            className="inline-flex w-fit items-center justify-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
          >
            Clear filters
          </Link>
        </div>
      </PageCard>

      <PageCard title="Audit trail" description="One row per meaningful event across the deal lifecycle.">
        <HistoryFeed
          events={events}
          emptyTitle="No activity matched"
          emptyDescription="Adjust the filters or widen the time window to surface more records."
        />
      </PageCard>
    </div>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.18em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink-950">{value}</div>
    </div>
  );
}

function FilterRow({
  label,
  currentValue,
  options,
  buildHref,
}: Readonly<{
  label: string;
  currentValue: string;
  options: ReadonlyArray<{ label: string; value: string }>;
  buildHref: (value: string) => string;
}>) {
  return (
    <div className="grid gap-3">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = currentValue === option.value || (!currentValue && option.value === "all");
          return (
            <Link
              key={option.value}
              href={buildHref(option.value)}
              className={[
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition",
                active
                  ? "border-accent-200 bg-[rgba(31,26,18,0.96)] text-accent-700"
                  : "border-ink-200 bg-[rgb(var(--surface))] text-ink-600 hover:border-accent-300 hover:text-accent-700",
              ].join(" ")}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
