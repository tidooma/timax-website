"use client";

import { SafeLogoImage } from "@/components/SafeLogoImage";
import { useEffect, useRef, useState } from "react";

const BEAR_LOGO_SOURCES = ["/images/bear-logo.webp", "/images/bear-logo.png"];

type GlowingBearProps = {
  className?: string;
  mobileBadge?: boolean;
  priority?: boolean;
};

export function GlowingBear({ className = "", mobileBadge = false, priority = false }: GlowingBearProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const sizeClass = mobileBadge
    ? "w-[min(27vw,5.25rem)]"
    : "w-[min(54vw,12.5rem)] sm:w-[min(54vw,19rem)] md:w-[min(45vw,22rem)] lg:w-[min(76vw,22.5rem)]";

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setIsRunning(entry.isIntersecting && !document.hidden), { threshold: 0.1 });
    const handleVisibility = () => setIsRunning(!document.hidden && element.getBoundingClientRect().bottom > 0 && element.getBoundingClientRect().top < window.innerHeight);
    observer.observe(element);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", handleVisibility); };
  }, []);

  return (
    <div ref={containerRef} className={`glowing-bear ${mobileBadge ? "glowing-bear-badge" : ""} relative mx-auto aspect-square w-full max-w-[400px] overflow-visible ${sizeClass} ${className}`}>
      <div className={`bear-glow-outer absolute inset-0 rounded-full ${isRunning ? "loop-running" : "loop-paused"}`} />
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
        className="glowing-bear-image hero-bear-svg relative z-20 h-full w-full object-contain"
      />
    </div>
  );
}
