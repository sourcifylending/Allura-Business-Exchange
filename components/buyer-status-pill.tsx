import type { BuyerStage, InquiryStatus } from "@/lib/buyer-ops";

export function BuyerStatusPill({
  status,
}: Readonly<{
  status: BuyerStage;
}>) {
  const tone =
    status === "qualified" || status === "active"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "watching"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
}

export function InquiryStatusPill({
  status,
}: Readonly<{
  status: InquiryStatus;
}>) {
  const tone =
    status === "qualified"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "reviewing" || status === "waiting"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "not_fit"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
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

