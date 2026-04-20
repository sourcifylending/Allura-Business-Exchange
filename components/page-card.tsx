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
    <section className="rounded-[1.75rem] border border-ink-200/90 bg-[rgba(18,20,23,0.96)] p-7 shadow-soft">
      <div className="mb-5 h-1 w-16 rounded-full bg-gradient-to-r from-accent-500 via-accent-300 to-transparent" />
      <h2 className="text-xl font-semibold tracking-tight text-ink-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
