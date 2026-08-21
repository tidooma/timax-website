"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star } from "lucide-react";
import { useMemo, type KeyboardEvent } from "react";
import type { ReviewDTO } from "@/lib/types";

type ReviewsProps = {
  reviews: ReviewDTO[];
};

export function Reviews({ reviews }: ReviewsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1
  });

  const loopedReviews = useMemo(() => {
    if (!reviews.length) return [];
    return [...reviews, ...reviews, ...reviews];
  }, [reviews]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi?.scrollNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi?.scrollPrev();
    }
  };

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
    <section id="reviews" className="section-surface relative scroll-mt-24 overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
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

        <div className="relative">
          <div
            className="embla overflow-hidden outline-none"
            ref={emblaRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ touchAction: "pan-y", willChange: "transform" }}
          >
            <div className="embla__container flex gap-6 pl-1 pr-1" style={{ willChange: "transform" }}>
              {loopedReviews.map((review, index) => (
                <article
                  key={`${review.id}-${index}`}
                  className="embla__slide min-w-0 shrink-0 basis-[86%] sm:basis-[52%] lg:basis-[31%] xl:basis-[31%]"
                >
                  <div className="group relative h-full rounded-[1.6rem] border border-blue-500/15 bg-white/[0.035] p-4 sm:p-5">
                    <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_38%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="relative z-10">
                      <Quote className="h-7 w-7 text-blue-500 transition-transform duration-200 group-hover:scale-110" />
                      <p className="mt-4 min-h-24 text-sm leading-6 text-white/70">{review.text}</p>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <h3 className="font-days text-lg tracking-normal">{review.clientName}</h3>
                        {review.rating ? (
                          <div className="flex gap-1 text-yellow-400">
                            {Array.from({ length: Math.min(review.rating, 5) }).map((_, starIndex) => (
                              <Star key={`${review.id}-star-${starIndex}`} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
