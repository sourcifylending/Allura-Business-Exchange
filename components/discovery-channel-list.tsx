export function DiscoveryChannelList({
  title,
  items,
}: Readonly<{
  title: string;
  items: string[];
}>) {
  return (
    <section className="rounded-[1.75rem] border border-ink-200 bg-white p-6 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">{title}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-sm font-medium text-ink-700"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

