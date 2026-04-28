"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const buyerNavItems = [
  { href: "/portal/buyer", label: "Dashboard", icon: "📊" },
  { href: "/portal/buyer/opportunities", label: "Opportunities", icon: "💼" },
  { href: "/portal/buyer/documents", label: "Documents", icon: "📄" },
  { href: "/portal/buyer/offers", label: "Offers", icon: "📋" },
  { href: "/portal/buyer/profile", label: "Profile", icon: "👤" },
];

export default function BuyerPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950">
      <nav className="border-b border-ink-200 bg-[rgba(18,20,23,0.96)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold tracking-widest text-accent-700 uppercase">
                Buyer Portal
              </div>
              <div className="mt-1 text-xl font-semibold text-ink-950">
                Allura Business Exchange
              </div>
            </div>
            <div className="text-sm text-ink-600">Private Deal Access</div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex flex-wrap gap-1 border-t border-ink-200 pt-4">
            {buyerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                  pathname === item.href
                    ? "border-accent-200 bg-[rgba(160, 120, 50, 0.96)] text-accent-700"
                    : "border-transparent text-ink-500 hover:border-ink-200 hover:bg-[rgb(var(--surface))] hover:text-ink-900",
                ].join(" ")}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
