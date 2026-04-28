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
      <div aria-label={alt} className={`leading-tight ${className}`}>
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-300">
          Allura
        </div>
      </div>
    );
  }

  return (
    <div aria-label={alt} className={`leading-tight ${className}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.32em] text-accent-300 sm:text-sm">
        Allura
      </div>
      <div className="mt-1 text-lg font-semibold text-white sm:text-xl">
        Business Exchange
      </div>
    </div>
  );
}
