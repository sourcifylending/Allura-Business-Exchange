export function DiscoverySegmentCard({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">{title}</div>
      <p className="mt-3 text-sm leading-6 text-ink-600">{description}</p>
    </article>
  );
}

