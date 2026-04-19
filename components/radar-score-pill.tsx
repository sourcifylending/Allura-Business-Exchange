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
    neutral: "border-ink-200 bg-ink-50 text-ink-700",
    positive: "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <div className={["rounded-2xl border px-4 py-3", toneClasses[tone]].join(" ")}>
      <div className="text-[11px] font-semibold tracking-[0.2em] uppercase">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

