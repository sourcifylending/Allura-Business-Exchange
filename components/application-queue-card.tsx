import Link from "next/link";
import { ApplicationStatusPill } from "@/components/application-status-pill";
import { formatApplicationDate } from "@/lib/application-review";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

export function ApplicationQueueCard({
  href,
  title,
  subtitle,
  email,
  phone,
  status,
  createdAt,
  summaryItems,
}: Readonly<{
  href: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  createdAt: string;
  summaryItems: Array<{
    label: string;
    value: string;
  }>;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
            Application
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink-950">{title}</h3>
          <div className="mt-1 text-sm text-ink-600">{subtitle}</div>
        </div>
        <ApplicationStatusPill status={status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail label="Email" value={email} />
        <Detail label="Phone" value={phone} />
        <Detail label="Created" value={formatApplicationDate(createdAt)} />
        <Detail label="Status" value={status.replaceAll("_", " ")} />
      </div>

      <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-dashed border-ink-200 bg-[rgb(var(--surface))] p-4">
        {summaryItems.map((item) => (
          <Mini key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs font-medium tracking-[0.14em] text-ink-500 uppercase">
          Review only in admin
        </div>
        <Link
          href={href}
          className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:text-accent-600"
        >
          Review
        </Link>
      </div>
    </article>
  );
}

function Detail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

function Mini({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-700">{value}</div>
    </div>
  );
}
