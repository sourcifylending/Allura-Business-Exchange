export function RadarScorePill({
  label,
  value,
  tone = "neutral",
}: Readonly<{
  label: string;
  value: string | number;
  tone?: "neutral" | "positive" | "warning" | "danger";
}>) {
  const toneClasses: Record<typeof tone, string> = {
    neutral: "border-ink-200 bg-[rgb(var(--surface))] text-ink-500",
    positive: "border-accent-200 bg-[rgba(31,26,18,0.96)] text-accent-700",
    warning: "border-amber-200 bg-[rgba(52,40,18,0.96)] text-amber-700",
    danger: "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
  };

  return (
    <div className={["rounded-2xl border px-4 py-3", toneClasses[tone]].join(" ")}>
      <div className="text-[11px] font-semibold tracking-[0.2em] uppercase">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
