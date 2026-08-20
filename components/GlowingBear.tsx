"use client";

import { motion } from "framer-motion";
import { SafeLogoImage } from "@/components/SafeLogoImage";

const BEAR_LOGO_SOURCES = ["/images/bear-logo.webp", "/images/bear-logo.png"];

const glowVariants = {
  initial: { opacity: 0.4, scale: 1.3 },
  animate: { opacity: [0.4, 0.5, 0.4], scale: [1.3, 1.35, 1.3] }
};

type GlowingBearProps = {
  className?: string;
  mobileBadge?: boolean;
  priority?: boolean;
};

export function GlowingBear({ className = "", mobileBadge = false, priority = false }: GlowingBearProps) {
  const sizeClass = mobileBadge
    ? "w-[min(27vw,5.25rem)]"
    : "w-[min(54vw,12.5rem)] sm:w-[min(54vw,19rem)] md:w-[min(45vw,22rem)] lg:w-[min(76vw,22.5rem)]";

  return (
    <div className={`glowing-bear ${mobileBadge ? "glowing-bear-badge" : ""} relative mx-auto aspect-square w-full max-w-[400px] overflow-visible ${sizeClass} ${className}`}>
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="bear-glow-outer absolute inset-0 rounded-full"
      />
      <div className="bear-glow-mid absolute inset-0 rounded-full" />
      <div className="bear-glow-core absolute inset-0 rounded-full" />
      <div className="bear-glow-center absolute inset-0 rounded-full" />

      <SafeLogoImage
        sources={BEAR_LOGO_SOURCES}
        alt="Медведь Timax"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        sizes={mobileBadge ? "(max-width: 767px) 120px, 160px" : "(max-width: 1023px) 340px, 420px"}
        optimized
        width={1272}
        height={1236}
        className="glowing-bear-image hero-bear-svg relative z-20 h-full w-full object-contain drop-shadow-[0_0_28px_rgba(56,189,248,0.58)]"
      />
    </div>
  );
}
