export function SectionHeading({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold tracking-[0.28em] text-accent-700 uppercase">
        {eyebrow}
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-ink-950 sm:text-2xl md:text-[2rem]">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">{description}</p>
    </div>
  );
}
