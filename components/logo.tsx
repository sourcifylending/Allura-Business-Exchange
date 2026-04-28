type LogoVariant = "full" | "symbol";

type LogoProps = Readonly<{
  variant: LogoVariant;
  className?: string;
  priority?: boolean;
  alt?: string;
}>;

export function Logo({ variant, className = "", alt = "Allura Business Exchange" }: LogoProps) {
  if (variant === "symbol") {
    return (
      <div
        aria-label={alt}
        className={`flex items-center justify-center rounded-full border border-accent-400/50 bg-accent-500/10 text-sm font-bold text-accent-300 ${className}`}
      >
        A
      </div>
    );
  }

  return (
    <div aria-label={alt} className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-400/50 bg-accent-500/10 text-sm font-bold text-accent-300">
        A
      </div>
      <div className="leading-tight">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-300">
          Allura
        </div>
        <div className="text-sm font-semibold text-white sm:text-base">
          Business Exchange
        </div>
      </div>
    </div>
  );
}
