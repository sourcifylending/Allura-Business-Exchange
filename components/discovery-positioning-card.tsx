export function DiscoveryPositioningCard({
  title,
  angle,
  categories,
}: Readonly<{
  title: string;
  angle: string;
  categories: string[];
}>) {
  return (
    <article className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">{title}</div>
      <p className="mt-3 text-sm leading-6 text-ink-600">{angle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full border border-accent-200 bg-[rgb(var(--accent-soft))] px-3 py-1 text-sm font-medium text-accent-800"
          >
            {category}
          </span>
        ))}
      </div>
    </article>
  );
}

