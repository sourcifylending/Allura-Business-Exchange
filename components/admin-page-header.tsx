export function AdminPageHeader({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white px-6 py-5 shadow-soft">
      <h1 className="text-2xl font-semibold text-ink-950">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">{description}</p>
    </section>
  );
}
