"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PortalNavItem, PortalRole } from "@/lib/portal-navigation";

const statusStyles: Record<string, string> = {
  invited: "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  activated: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  approved: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
  pending: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  submitted: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  under_review: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  rejected: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
};

export function PortalNavigation({
  navItems,
  role,
  accountName,
  accountEmail,
  status,
}: Readonly<{
  navItems: PortalNavItem[];
  role: PortalRole;
  accountName: string;
  accountEmail: string;
  status: string;
}>) {
  const pathname = usePathname();

  return (
    <aside className="rounded-[1.75rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft backdrop-blur-xl">
      <div className="grid gap-4">
        <div className="rounded-3xl border border-ink-200 bg-[rgb(var(--surface))] p-4">
          <div className="text-[11px] font-semibold tracking-[0.22em] text-ink-500 uppercase">
            Signed in
          </div>
          <div className="mt-1 text-lg font-semibold text-ink-950">{accountName}</div>
          <div className="mt-1 text-sm leading-6 text-ink-600">{accountEmail}</div>
          <div className="mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase">
            {role === "buyer" ? "Buyer portal" : "Seller portal"}
          </div>
          <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${statusStyles[status] ?? statusStyles.pending}`}>
            {status.replaceAll("_", " ")}
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const currentPath = pathname ?? "";
            const active =
              currentPath === item.href ||
              (currentPath.startsWith(item.href) &&
                item.href !== "/portal/buyer" &&
                item.href !== "/portal/seller");

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "block rounded-2xl border px-4 py-3 text-sm font-medium transition",
                  active
                    ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
                    : "border-transparent text-ink-500 hover:border-ink-200 hover:bg-[rgb(var(--surface))] hover:text-ink-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action="/portal/sign-out" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-accent-300 hover:text-accent-700"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
