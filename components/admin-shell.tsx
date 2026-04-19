"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { adminNavItems } from "@/lib/navigation";

export function AdminShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(31,27,23,0.04),rgba(31,27,23,0.01))]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[290px_1fr] lg:px-6">
        <aside className="rounded-[1.75rem] border border-ink-200 bg-white p-5 shadow-soft">
          <Link href="/" className="mb-8 block">
            <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
              Allura Admin
            </div>
            <div className="mt-1 text-lg font-semibold text-ink-950">Exchange OS</div>
          </Link>
          <nav className="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto pr-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={[
                  "block rounded-2xl border px-4 py-3 text-sm font-medium transition",
                  pathname === item.href
                    ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
                    : "border-transparent text-ink-700 hover:border-ink-200 hover:bg-ink-50 hover:text-ink-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-3xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
            Placeholder admin shell only. No auth, database, or external integrations yet.
          </div>
        </aside>
        <div className="flex flex-col gap-6">
          <header className="rounded-[1.75rem] border border-ink-200 bg-white px-6 py-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-accent-700 uppercase">
                  Internal Portal
                </div>
                <div className="mt-1 text-2xl font-semibold text-ink-950">
                  Dashboard Placeholder
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">
                  Central command center for Market Radar, asset packaging, listings, buyer
                  activity, and transfer operations in later phases.
                </p>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-right">
                <div className="text-[11px] font-semibold tracking-[0.22em] text-ink-500 uppercase">
                  Focus
                </div>
                <div className="mt-1 text-sm font-medium text-ink-900">
                  AI assets first, business lane secondary
                </div>
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
