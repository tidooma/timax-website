"use client";

import { Quote, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReviewDTO } from "@/lib/types";

type ReviewsProps = {
  reviews: ReviewDTO[];
};

export function Reviews({ reviews }: ReviewsProps) {
  const reviewsScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = reviewsScrollerRef.current;
    if (!scroller || reviews.length < 2) return;

    let animationFrame = 0;
    let paused = false;
    let lastFrameTime = 0;
    let resumeTimeout = 0;

    const advance = (time: number) => {
      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 50) : 0;
      lastFrameTime = time;

      if (!paused && elapsed > 0) {
        const cycleWidth = scroller.scrollWidth / 3;
        scroller.scrollLeft += elapsed * 0.022;

        if (cycleWidth > 0 && scroller.scrollLeft >= cycleWidth) {
          scroller.scrollLeft -= cycleWidth;
        }
      }

      animationFrame = window.requestAnimationFrame(advance);
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    const pauseAfterTouch = () => {
      paused = true;
      window.clearTimeout(resumeTimeout);
      resumeTimeout = window.setTimeout(resume, 1200);
    };

    scroller.addEventListener("mouseenter", pause);
    scroller.addEventListener("mouseleave", resume);
    scroller.addEventListener("pointerdown", pauseAfterTouch);
    scroller.addEventListener("pointerup", pauseAfterTouch);
    scroller.addEventListener("pointercancel", pauseAfterTouch);
    scroller.addEventListener("touchstart", pauseAfterTouch, { passive: true });
    scroller.addEventListener("touchend", pauseAfterTouch, { passive: true });
    scroller.addEventListener("touchcancel", pauseAfterTouch, { passive: true });
    scroller.addEventListener("focusin", pause);
    scroller.addEventListener("focusout", resume);
    animationFrame = window.requestAnimationFrame(advance);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resumeTimeout);
      scroller.removeEventListener("mouseenter", pause);
      scroller.removeEventListener("mouseleave", resume);
      scroller.removeEventListener("pointerdown", pauseAfterTouch);
      scroller.removeEventListener("pointerup", pauseAfterTouch);
      scroller.removeEventListener("pointercancel", pauseAfterTouch);
      scroller.removeEventListener("touchstart", pauseAfterTouch);
      scroller.removeEventListener("touchend", pauseAfterTouch);
      scroller.removeEventListener("touchcancel", pauseAfterTouch);
      scroller.removeEventListener("focusin", pause);
      scroller.removeEventListener("focusout", resume);
    };
  }, [reviews.length]);

  if (!reviews.length) {
    return (
      <section id="reviews" className="section-surface relative scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-dashed border-blue-500/30 bg-blue-500/[0.08] p-8 text-center text-white/60">
          Отзывы скоро появятся.
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="section-surface relative scroll-mt-24 overflow-visible px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 shadow-blue">
              <Quote className="h-4 w-4" />
              Отзывы
            </div>
            <h2 className="font-days text-3xl tracking-normal sm:text-4xl md:text-5xl">Отзывы клиентов</h2>
          </div>
        </div>

        <div ref={reviewsScrollerRef} className="reviews-scroll flex touch-pan-x snap-x snap-mandatory gap-6 overflow-x-auto py-8">
          {[0, 1, 2].map((copy) => reviews.map((review) => (
              <article key={`${review.id}-${copy}`} className="w-[280px] shrink-0 snap-start sm:w-[300px]">
                <div className="group relative h-full rounded-[1.6rem] border border-blue-500/15 bg-white/[0.035] p-4 transition-[box-shadow,border-color] duration-300 hover:border-blue-500/40 hover:bg-blue-500/[0.03] hover:shadow-blue sm:p-5">
                  <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_38%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <Quote className="h-7 w-7 text-blue-500" />
                    <p className="mt-4 min-h-24 text-sm leading-6 text-white/70">{review.text}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <h3 className="font-days text-lg tracking-normal">{review.clientName}</h3>
                      {review.rating ? <div className="flex gap-1 text-yellow-400">{Array.from({ length: Math.min(review.rating, 5) }).map((_, starIndex) => <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />)}</div> : null}
                    </div>
                  </div>
                </div>
              </article>
          )))}
        </div>
      </div>
    </section>
  );
}
