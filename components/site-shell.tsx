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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
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
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
        <section
          className={
            showHeroPanel
              ? "grid gap-6 rounded-[1.5rem] border border-ink-200 bg-[rgba(17,19,22,0.92)] p-4 shadow-soft sm:gap-8 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12 lg:rounded-[2rem]"
              : "grid gap-6 rounded-[1.5rem] border border-ink-200 bg-[rgba(17,19,22,0.92)] p-4 shadow-soft sm:gap-8 sm:p-8 lg:p-12 lg:rounded-[2rem]"
          }
        >
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-600 sm:mt-4 sm:text-base sm:leading-7 md:text-lg">
              {description}
            </p>
          </div>
          {showHeroPanel ? (
            <div className="grid gap-4 rounded-[1.25rem] border border-ink-200 bg-[rgba(160,120,50,0.12)] p-4 sm:gap-5 sm:p-6 lg:rounded-[1.75rem]">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink-200 bg-[rgb(var(--surface-strong))] shadow-sm sm:h-20 sm:w-14">
                  <Logo variant="symbol" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
                    Product Focus
                  </div>
                  <div className="mt-1 text-base font-medium text-ink-950 sm:text-lg">
                    AI assets first. Business opportunities second.
                  </div>
                </div>
              </div>
              <div className="text-xs leading-5 text-ink-600 sm:text-sm sm:leading-6">
                A controlled exchange designed for speed from idea to sale, with clean packaging and
                simple transfer workflows.
              </div>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 sm:gap-3">
                {["Controlled intake", "Branded listings", "Simple transfers"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-ink-200 bg-[rgb(var(--surface))] px-3 py-2 text-xs font-semibold tracking-[0.12em] text-ink-500 uppercase sm:rounded-2xl sm:py-3"
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
