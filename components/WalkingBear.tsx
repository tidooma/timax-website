"use client";

import { SafeLogoImage } from "@/components/SafeLogoImage";

const BEAR_LOGO_SOURCES = ["/images/bear-logo-160.png", "/images/bear-logo.png", "/images/bear-logo.svg"];
const BEAR_LOGO_SRC_SET = "/images/bear-logo-160.png 160w, /images/bear-logo-420.png 420w, /images/bear-logo.png 1254w";

type WalkingBearProps = {
  className?: string;
};

export function WalkingBear({ className = "" }: WalkingBearProps) {
  return (
    <span
      className={`header-bear pointer-events-none relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-500/20 bg-black shadow-logo sm:h-12 sm:w-12 ${className}`}
      aria-hidden="true"
    >
      <SafeLogoImage
        sources={BEAR_LOGO_SOURCES}
        alt=""
        fetchPriority="high"
        loading="eager"
        sizes="(max-width: 767px) 40px, 48px"
        srcSet={BEAR_LOGO_SRC_SET}
        className="header-bear-image h-full w-full object-cover"
      />
    </span>
  );
}
