export function PageCard({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-ink-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600">{description}</p>
    </section>
  );
}
