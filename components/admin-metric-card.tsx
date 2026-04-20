export function AdminMetricCard({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <div className="rounded-[1.5rem] border border-ink-200 bg-[rgba(18,20,23,0.96)] p-5 shadow-soft">
      <div className="text-xs font-semibold tracking-[0.22em] text-accent-700 uppercase">
        {label}
      </div>
      <div className="mt-4 h-14 rounded-2xl border border-dashed border-ink-200 bg-[rgb(var(--surface))]" />
      <div className="mt-3 text-sm text-ink-600">Placeholder metric card.</div>
    </div>
  );
}
