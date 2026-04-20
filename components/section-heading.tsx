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
      <h2 className="text-2xl font-semibold tracking-tight text-ink-950 md:text-[2rem]">
        {title}
      </h2>
      <p className="max-w-3xl text-base leading-7 text-ink-600">{description}</p>
    </div>
  );
}
