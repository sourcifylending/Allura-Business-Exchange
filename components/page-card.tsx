import type { ReactNode } from "react";

export function PageCard({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children?: ReactNode;
}>) {
  return (
    <section className="rounded-[1.25rem] border border-ink-200/90 bg-[rgba(18,20,23,0.96)] p-4 shadow-soft sm:rounded-[1.75rem] sm:p-6 lg:p-7">
      <div className="mb-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent-500 via-accent-300 to-transparent sm:mb-5" />
      <h2 className="text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-xs leading-5 text-ink-600 sm:text-sm sm:leading-6">{description}</p>
      {children ? <div className="mt-4 sm:mt-5">{children}</div> : null}
    </section>
  );
}
