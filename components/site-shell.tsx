import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { getAppUrl } from "@/lib/app-url";
import { publicNavItems } from "@/lib/navigation";

function BrandMark() {
  return (
    <div className="relative h-11 w-[12.5rem] overflow-hidden">
      <Logo variant="full" />
    </div>
  );
}

export function SiteShell({
  children,
  eyebrow,
  title,
  description,
  showPublicNav = true,
  showSignInCta = true,
  showHeroPanel = true,
}: Readonly<{
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  showPublicNav?: boolean;
  showSignInCta?: boolean;
  showHeroPanel?: boolean;
}>) {
  const appLoginHref = getAppUrl() ? new URL("/login", getAppUrl()).toString() : "/login";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-[rgba(10,11,13,0.8)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-4">
            {showPublicNav ? (
              <nav className="hidden flex-wrap items-center gap-5 text-sm text-ink-500 md:flex">
                {publicNavItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-ink-950">
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
            {showSignInCta ? (
              <Link
                href={appLoginHref}
                className="inline-flex items-center rounded-full border border-ink-200 bg-[rgb(var(--surface))] px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-accent-500 hover:text-accent-700"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        <section
          className={
            showHeroPanel
              ? "grid gap-8 rounded-[2rem] border border-ink-200 bg-[rgba(17,19,22,0.92)] p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-12"
              : "grid gap-8 rounded-[2rem] border border-ink-200 bg-[rgba(17,19,22,0.92)] p-8 shadow-soft lg:p-12"
          }
        >
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="mb-4 text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-4xl font-semibold tracking-tight text-ink-950 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-600 md:text-lg">
              {description}
            </p>
          </div>
          {showHeroPanel ? (
            <div className="grid gap-5 rounded-[1.75rem] border border-ink-200 bg-[rgba(160,120,50,0.12)] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-14 items-center justify-center overflow-hidden rounded-full border border-ink-200 bg-[rgb(var(--surface-strong))] shadow-sm">
                  <Logo variant="symbol" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
                    Product Focus
                  </div>
                  <div className="text-lg font-medium text-ink-950">
                    AI assets first. Business opportunities second.
                  </div>
                </div>
              </div>
              <div className="text-sm leading-6 text-ink-600">
                A controlled exchange designed for speed from idea to sale, with clean packaging and
                simple transfer workflows.
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Controlled intake", "Branded listings", "Simple transfers"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-ink-200 bg-[rgb(var(--surface))] px-3 py-3 text-xs font-semibold tracking-[0.12em] text-ink-500 uppercase"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
        {children}
      </main>
    </div>
  );
}
