import Link from "next/link";

export function ApplicationDocumentActions({
  viewHref,
  downloadHref,
}: Readonly<{
  viewHref: string;
  downloadHref: string;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={viewHref}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-ink-200 bg-[rgba(18,20,23,0.96)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-ink-600 uppercase transition hover:border-accent-300 hover:text-accent-700"
      >
        View
      </Link>
      <Link
        href={downloadHref}
        className="rounded-full border border-accent-200 bg-[rgba(31,26,18,0.96)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-accent-700 uppercase transition hover:border-accent-300 hover:text-accent-600"
      >
        Download
      </Link>
    </div>
  );
}
