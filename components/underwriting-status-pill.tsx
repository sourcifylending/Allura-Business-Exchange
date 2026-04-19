import type { RiskLevel, UnderwritingStatus } from "@/lib/business-underwriting";

export function UnderwritingStatusPill({
  status,
}: Readonly<{
  status: UnderwritingStatus;
}>) {
  const tone =
    status === "approved"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "hold"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "rejected"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status}</Badge>;
}

export function RiskLevelPill({
  level,
  label,
}: Readonly<{
  level: RiskLevel;
  label: string;
}>) {
  const tone =
    level === "high"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : level === "medium"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800";

  return <Badge tone={tone}>{label}</Badge>;
}

function Badge({
  tone,
  children,
}: Readonly<{
  tone: string;
  children: string;
}>) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
        tone,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

