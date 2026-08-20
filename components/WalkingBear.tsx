"use client";

import { SafeLogoImage } from "@/components/SafeLogoImage";

const BEAR_LOGO_SOURCES = ["/images/bear-logo.webp", "/images/bear-logo.png"];

type WalkingBearProps = {
  className?: string;
};

export function WalkingBear({ className = "" }: WalkingBearProps) {
  return (
    <span
      className={`header-bear pointer-events-none relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-visible sm:h-11 sm:w-11 ${className}`}
      aria-hidden="true"
    >
      <SafeLogoImage
        sources={BEAR_LOGO_SOURCES}
        alt=""
        fetchPriority="high"
        loading="eager"
        sizes="(max-width: 767px) 36px, 44px"
        optimized
        width={1272}
        height={1236}
        className="header-bear-image relative z-10 h-full w-full object-contain"
      />
    </span>
  );
}
