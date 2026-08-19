"use client";

import { SafeLogoImage } from "@/components/SafeLogoImage";

const BEAR_LOGO_SOURCES = ["/images/bear-logo-420.png", "/images/bear-logo.png", "/images/bear-logo.svg"];
const BEAR_LOGO_SRC_SET = "/images/bear-logo-160.png 160w, /images/bear-logo-420.png 420w, /images/bear-logo.png 1254w";

type GlowingBearProps = {
  className?: string;
  mobileBadge?: boolean;
  priority?: boolean;
};

export function GlowingBear({ className = "", mobileBadge = false, priority = false }: GlowingBearProps) {
  const sizeClass = mobileBadge
    ? "w-[min(38vw,7.5rem)]"
    : "w-[min(58vw,13.5rem)] sm:w-[min(58vw,21rem)] md:w-[min(48vw,24rem)] lg:w-[min(82vw,24rem)]";

  return (
    <div className={`glowing-bear ${mobileBadge ? "glowing-bear-badge" : ""} relative mx-auto aspect-square max-w-full ${sizeClass} ${className}`}>
      <div className="hero-bear-aura absolute inset-[8%] rounded-full" />
      <div className="hero-bear-ring absolute inset-[3%] rounded-full" />

      <SafeLogoImage
        sources={BEAR_LOGO_SOURCES}
        alt="Медведь Timax"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        sizes={mobileBadge ? "(max-width: 767px) 120px, 160px" : "(max-width: 1023px) 340px, 420px"}
        srcSet={BEAR_LOGO_SRC_SET}
        className="glowing-bear-image hero-bear-svg relative z-10 h-full w-full object-contain"
      />
    </div>
  );
}
