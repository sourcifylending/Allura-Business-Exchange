import Link from "next/link";
import type { ReactNode } from "react";
import { publicNavItems } from "@/lib/navigation";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-ink-200 bg-white shadow-sm">
        <div className="h-4 w-4 rounded-full bg-accent-500" />
      </div>
      <div>
        <div className="text-sm font-semibold tracking-[0.18em] text-ink-500 uppercase">
          Allura
        </div>
        <div className="text-sm text-ink-600">Business Exchange</div>
      </div>
    </div>
  );
}

export function SiteShell({
  children,
  eyebrow,
  title,
  description,
}: Readonly<{
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-200/80 bg-[rgba(247,244,239,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>
          <nav className="hidden flex-wrap items-center gap-5 text-sm text-ink-600 md:flex">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink-950">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin"
            className="rounded-full border border-ink-300 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-accent-500 hover:text-accent-700"
          >
            Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        <section className="grid gap-8 rounded-[2rem] border border-ink-200 bg-white/80 p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
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
          <div className="grid gap-4 rounded-[1.75rem] border border-ink-200 bg-[rgb(var(--accent-soft))] p-6">
            <div className="text-xs font-semibold tracking-[0.2em] text-accent-700 uppercase">
              Product Focus
            </div>
            <div className="text-lg font-medium text-ink-950">
              AI assets first. Business opportunities second.
            </div>
            <div className="text-sm leading-6 text-ink-600">
              A controlled exchange designed for speed from idea to sale, with clean packaging and
              simple transfer workflows.
            </div>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
