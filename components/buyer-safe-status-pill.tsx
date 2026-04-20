const statusStyles: Record<string, string> = {
  Submitted: "border-amber-200 bg-[rgba(42,32,12,0.96)] text-amber-700",
  "Under Review": "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  "Seller Reviewing": "border-sky-200 bg-[rgba(12,28,45,0.96)] text-sky-700",
  "Follow-up Needed": "border-rose-200 bg-[rgba(52,18,26,0.96)] text-rose-700",
  Declined: "border-ink-200 bg-[rgb(var(--surface))] text-ink-600",
  Advancing: "border-emerald-200 bg-[rgba(12,35,22,0.96)] text-emerald-700",
};

export function BuyerSafeStatusPill({
  status,
}: Readonly<{
  status: string;
}>) {
  const normalized = status in statusStyles ? status : "Submitted";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        statusStyles[normalized],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
