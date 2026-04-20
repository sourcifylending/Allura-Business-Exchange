import Link from "next/link";
import type { ReactNode } from "react";
import { ApplicationStatusPill } from "@/components/application-status-pill";
import { Logo } from "@/components/logo";
import { PortalNavigation } from "@/components/portal-navigation";
import type { PortalNavItem, PortalRole } from "@/lib/portal-navigation";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

function BrandMark() {
  return (
    <div className="relative h-11 w-[12.5rem] overflow-hidden">
      <Logo variant="full" />
    </div>
  );
}

function InfoCard({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">{label}</div>
      <div className="mt-1 text-sm leading-6 text-ink-800">{value}</div>
    </div>
  );
}

export function PortalShell({
  eyebrow,
  title,
  description,
  role,
  navItems,
  accountName,
  accountEmail,
  accountType,
  status,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  role: PortalRole;
  navItems: PortalNavItem[];
  accountName: string;
  accountEmail: string;
  accountType?: string;
  status?: ApplicationStatus | "pending";
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,172,92,0.08),transparent_26%),linear-gradient(180deg,rgba(10,11,13,0.98),rgba(15,17,19,0.98))]">
      <header className="border-b border-ink-200/70 bg-[rgba(10,11,13,0.8)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink-200 bg-[rgba(18,20,23,0.96)] px-4 py-2 text-sm font-semibold text-ink-500 transition hover:border-accent-300 hover:text-accent-700"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <PortalNavigation
            navItems={navItems}
            role={role}
            accountName={accountName}
            accountEmail={accountEmail}
            status={status ?? "pending"}
          />

          <div className="grid gap-6">
            <div className="grid gap-8 rounded-[2rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
              <div className="max-w-2xl">
                <p className="mb-4 text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                  {eyebrow}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">{title}</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-ink-600 md:text-lg">{description}</p>
              </div>
              <div className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgba(31,26,18,0.92)] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-14 items-center justify-center overflow-hidden rounded-full border border-ink-200 bg-[rgb(var(--surface-strong))] shadow-sm">
                    <Logo variant="symbol" className="h-10 w-10 object-contain" />
                  </div>
                  <div className="grid gap-1">
                    <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
                      Private Portal
                    </div>
                    <div className="text-lg font-medium text-ink-950">Invite-only access</div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {accountType ? <InfoCard label="Account type" value={accountType} /> : null}
                  {status ? (
                    <div className="rounded-2xl border border-ink-200 bg-[rgba(18,20,23,0.96)] p-4">
                      <div className="text-[11px] font-semibold tracking-[0.2em] text-ink-500 uppercase">
                        Access status
                      </div>
                      <div className="mt-2">
                        {status === "pending" ? (
                          <span className="inline-flex items-center rounded-full border border-amber-200 bg-[rgba(42,32,12,0.96)] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-700">
                            Pending
                          </span>
                        ) : (
                          <ApplicationStatusPill status={status} />
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
