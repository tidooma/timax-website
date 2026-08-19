import { SafeLogoImage } from "@/components/SafeLogoImage";

type TimaxLogoProps = {
  compact?: boolean;
  footer?: boolean;
  hero?: boolean;
  className?: string;
  priority?: boolean;
};

const WORDMARK_SOURCES = ["/images/logos/timax-wordmark.png", "/images/logos/timax-wordmark.svg"];

export function TimaxLogo({ compact = false, footer = false, hero = false, className = "", priority = false }: TimaxLogoProps) {
  const sizeClass = hero
    ? "h-14 w-[min(76vw,21rem)] sm:h-20 sm:w-[24rem] lg:h-24 lg:w-[29rem]"
    : footer
      ? "h-12 w-44 sm:h-16 sm:w-60"
      : compact
        ? "h-7 w-24 max-[360px]:w-20 sm:h-8 sm:w-28"
        : "h-9 w-32 sm:h-11 sm:w-40";
  const fallbackClass = hero
    ? "text-[2.65rem] sm:text-6xl lg:text-7xl"
    : footer
      ? "text-4xl sm:text-5xl"
      : compact
        ? "text-xl"
        : "text-xl sm:text-2xl md:text-3xl";
  const sizes = hero
    ? "(max-width: 639px) 76vw, (max-width: 1023px) 384px, 464px"
    : footer
      ? "(max-width: 639px) 176px, 240px"
      : compact
        ? "(max-width: 639px) 96px, 112px"
        : "160px";

  return (
    <span
      aria-label="Timax"
      className={`timax-wordmark relative inline-flex shrink-0 items-center justify-center text-current ${hero ? "timax-wordmark-hero" : ""} ${sizeClass} ${className}`}
    >
      <SafeLogoImage
        sources={WORDMARK_SOURCES}
        alt="Timax"
        height={hero ? 188 : 94}
        loading={priority ? "eager" : "lazy"}
        optimized
        priority={priority}
        sizes={sizes}
        width={hero ? 640 : 320}
        className="relative z-10 h-full w-full object-contain"
        fallback={
          <span className={`flex h-full w-full items-center justify-center whitespace-nowrap font-days tracking-normal ${fallbackClass}`}>
            Tim
            <span className="inline-block -translate-y-[1px] scale-x-110">A</span>x
          </span>
        }
      />
    </span>
  );
}
