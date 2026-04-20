import Image from "next/image";

type LogoVariant = "full" | "symbol";

type LogoProps = Readonly<{
  // Use `full` only where the wordmark is comfortably readable.
  // Use `symbol` for compact UI, pills, badges, and small icon blocks.
  variant: LogoVariant;
  className?: string;
  priority?: boolean;
  alt?: string;
}>;

export function Logo({
  variant,
  className = "h-full w-full object-contain",
  priority = false,
  alt = "Allura Business Exchange",
}: LogoProps) {
  if (variant === "symbol") {
    return (
      <Image
        src="/brand/icon.png"
        alt={alt}
        width={500}
        height={500}
        priority={priority}
        className={className}
      />
    );
  }

  return <img src="/brand/horizontal.svg" alt={alt} className={className} />;
}
