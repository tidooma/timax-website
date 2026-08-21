"use client";

import { Play, Send } from "lucide-react";
import { GlowingBear } from "@/components/GlowingBear";
import { TimaxLogo } from "@/components/TimaxLogo";
import { useClickSound } from "@/hooks/useSound";
import type { HeroBannerDTO } from "@/lib/types";
import type { ContentSection } from "@/lib/content";

type HeroProps = {
  onOrderOpen: () => void;
  banner?: HeroBannerDTO | null;
  content?: ContentSection;
};

export function Hero({ onOrderOpen, banner, content }: HeroProps) {
  const playClick = useClickSound();

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-1rem)] items-center overflow-hidden px-3 pb-4 pt-[calc(3.75rem+env(safe-area-inset-top))] sm:min-h-[100svh] sm:px-6 sm:pb-12 sm:pt-20 lg:min-h-[calc(100svh-2rem)] lg:px-8 lg:pb-4 lg:pt-14"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
        <div className="relative z-10 flex w-full min-w-0 flex-col items-center">
          {banner ? (
            <div className="mb-5 inline-flex max-w-[min(92vw,42rem)] items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-center text-[0.68rem] font-semibold tracking-[0.12em] text-blue-200 uppercase shadow-blue backdrop-blur-sm sm:text-[0.72rem]">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-400" />
              <span>{banner.title}</span>
            </div>
          ) : null}

          <h1 className="mx-auto w-full max-w-[22rem] break-words [overflow-wrap:anywhere] font-days text-[clamp(2.15rem,9.6vw,3rem)] uppercase leading-[0.98] tracking-normal text-balance sm:max-w-3xl sm:text-[clamp(3.6rem,9vw,6.6rem)] lg:max-w-5xl lg:text-[clamp(4.6rem,7.5vw,6.8rem)]">
            {(() => {
              const words = (content?.title ?? "ТЕБЕ НУЖЕН МОНТАЖ").trim().split(/\s+/);
              return [words.slice(0, 2).join(" "), words.slice(2).join(" ")].filter(Boolean).map((line, index) => <span key={`${line}-${index}`} className="block">{line}</span>);
            })()}
          </h1>

          <div className="mb-1 mt-2 flex justify-center sm:mb-5 sm:mt-5 lg:hidden">
            <GlowingBear mobileBadge priority />
          </div>

          <div className="relative mt-1 flex justify-center sm:mt-6 lg:mt-3">
            <span className="hero-logo-glow" aria-hidden="true" />
            <TimaxLogo hero priority />
          </div>

          <p className="mx-auto mt-2 max-w-[18rem] text-[0.82rem] leading-5 text-black/66 dark:text-white/68 sm:mt-6 sm:max-w-2xl sm:text-base md:text-xl md:leading-8 lg:mt-3">
            {banner?.description ?? content?.description ?? "Профессиональный видеомонтаж для YouTube, TikTok, Instagram и др."}
          </p>
          <p className="mx-auto mt-1 max-w-[19rem] text-[0.64rem] leading-4 text-black/45 dark:text-white/45 sm:max-w-2xl sm:text-xs">
            Meta (Instagram) признана экстремистской организацией на территории Российской Федерации.
          </p>

          <div className="mt-4 grid w-full max-w-[21rem] grid-cols-1 gap-2 sm:mt-7 sm:flex sm:max-w-none sm:justify-center sm:gap-3 lg:mt-4">
            <HeroActions onOrderOpen={onOrderOpen} playClick={playClick} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroActions({ onOrderOpen, playClick, compact = false }: HeroProps & { compact?: boolean; playClick: () => void }) {
  const baseClass = compact
    ? "min-h-12 w-full min-w-0 rounded-2xl px-2 py-3 text-[0.78rem] sm:text-sm"
    : "min-h-12 w-full min-w-0 rounded-2xl px-4 py-3 text-sm sm:min-h-14 sm:w-auto sm:px-6 sm:py-4 sm:text-base lg:min-h-[4.25rem] lg:px-9 lg:py-5 lg:text-lg";
  const labelClass = compact ? "text-center leading-tight" : "text-center leading-tight sm:whitespace-nowrap";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          playClick();
          document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className={`tech-button inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 ${baseClass}`}
      >
        <Play className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        <span className={labelClass}>Смотреть работы</span>
      </button>
      <button
        type="button"
        onClick={() => {
          playClick();
          onOrderOpen();
        }}
        className={`tech-button-subtle inline-flex items-center justify-center gap-2 rounded-full font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/50 hover:bg-white/10 ${baseClass}`}
      >
        <Send className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        <span className={labelClass}>Экспресс заказ</span>
      </button>
    </>
  );
}
