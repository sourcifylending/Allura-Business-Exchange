import type { ContractStatus, PaymentStatus, SignatureStatus } from "@/lib/closeout-ops";

export function ContractStatusPill({
  status,
}: Readonly<{
  status: ContractStatus;
}>) {
  const tone =
    status === "signed"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "sent"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status}</Badge>;
}

export function SignatureStatusPill({
  status,
}: Readonly<{
  status: SignatureStatus;
}>) {
  const tone =
    status === "complete"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-ink-200 bg-ink-50 text-ink-700";

  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
}

export function PaymentStatusPill({
  status,
}: Readonly<{
  status: PaymentStatus;
}>) {
  const tone =
    status === "received"
      ? "border-accent-200 bg-[rgb(var(--accent-soft))] text-accent-800"
      : status === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return <Badge tone={tone}>{status}</Badge>;
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

