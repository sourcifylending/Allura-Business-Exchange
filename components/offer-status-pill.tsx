import type { OfferStage } from "@/lib/closeout-ops";

export function OfferStatusPill({
  stage,
}: Readonly<{
  stage: OfferStage;
}>) {
  const tone =
    stage === "accepted"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : stage === "countered"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : stage === "waiting"
          ? "border-ink-200 bg-ink-50 text-ink-700"
          : "border-accent-200 bg-white text-accent-800";

  return <Badge tone={tone}>{stage.replace("_", " ")}</Badge>;
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

