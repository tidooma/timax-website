"use client";

import { Play, Send } from "lucide-react";
import { GlowingBear } from "@/components/GlowingBear";
import { TimaxLogo } from "@/components/TimaxLogo";

type HeroProps = {
  onOrderOpen: () => void;
};

export function Hero({ onOrderOpen }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-10 pt-[calc(5.25rem+env(safe-area-inset-top))] sm:px-6 sm:pb-12 sm:pt-24 lg:px-8"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
        <div className="pointer-events-none absolute top-[57%] hidden -translate-y-1/2 opacity-40 lg:-right-32 lg:block xl:-right-36 2xl:-right-28">
          <GlowingBear />
        </div>

        <div className="relative z-10 flex w-full min-w-0 flex-col items-center">
          <div className="mb-5 flex justify-center lg:hidden">
            <GlowingBear mobileBadge priority />
          </div>

          <h1 className="mx-auto max-w-[22rem] break-words font-days text-[clamp(2.15rem,9.6vw,3rem)] uppercase leading-[0.98] tracking-normal text-balance sm:max-w-3xl sm:text-[clamp(3.6rem,9vw,6.6rem)] lg:max-w-5xl lg:text-[clamp(5.25rem,8.8vw,8rem)]">
            <span className="block">ТЕБЕ НУЖЕН</span>
            <span className="block">МОНТАЖ</span>
          </h1>

          <div className="mt-4 flex justify-center sm:mt-6">
            <TimaxLogo hero priority />
          </div>

          <p className="mx-auto mt-4 max-w-[19rem] text-sm leading-6 text-black/66 dark:text-white/68 sm:mt-6 sm:max-w-2xl sm:text-base md:text-xl md:leading-8">
            Профессиональный видеомонтаж для YouTube, TikTok, Instagram* и др.
          </p>
          <p className="mx-auto mt-1 max-w-[19rem] text-[0.64rem] leading-4 text-black/45 dark:text-white/45 sm:max-w-2xl sm:text-xs">
            * - признан экстремистским контентом на территории РФ
          </p>

          <div className="mt-7 grid w-full max-w-xs grid-cols-1 gap-2 sm:flex sm:max-w-none sm:justify-center sm:gap-3">
            <HeroActions onOrderOpen={onOrderOpen} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroActions({ onOrderOpen, compact = false }: HeroProps & { compact?: boolean }) {
  const baseClass = compact
    ? "min-h-12 w-full min-w-0 rounded-2xl px-2 py-3 text-[0.78rem] sm:text-sm"
    : "min-h-12 w-full min-w-0 rounded-2xl px-4 py-3 text-sm sm:min-h-14 sm:w-auto sm:px-6 sm:py-4 sm:text-base lg:min-h-[4.25rem] lg:px-9 lg:py-5 lg:text-lg";
  const labelClass = compact ? "text-center leading-tight" : "text-center leading-tight sm:whitespace-nowrap";

  return (
    <>
      <button
        type="button"
        onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "auto", block: "start" })}
        className={`inline-flex items-center justify-center gap-2 bg-blue-500 font-bold text-white shadow-blue transition hover:scale-[1.02] hover:bg-blue-400 ${baseClass}`}
      >
        <Play className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        <span className={labelClass}>Смотреть работы</span>
      </button>
      <button
        type="button"
        onClick={onOrderOpen}
        className={`inline-flex items-center justify-center gap-2 border border-black/10 bg-white/65 font-bold text-black transition hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-blue dark:border-white/10 dark:bg-white/10 dark:text-white ${baseClass}`}
      >
        <Send className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        <span className={labelClass}>Экспресс заказ</span>
      </button>
    </>
  );
}
