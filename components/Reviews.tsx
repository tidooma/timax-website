"use client";

import { Quote, Star } from "lucide-react";
import { useMemo } from "react";
import type { ReviewDTO } from "@/lib/types";

type ReviewsProps = {
  reviews: ReviewDTO[];
};

export function Reviews({ reviews }: ReviewsProps) {
  const loopedReviews = useMemo(() => {
    if (!reviews.length) return [];

    const targetLength = Math.max(reviews.length * 2, 8);
    return Array.from({ length: targetLength }, (_, index) => reviews[index % reviews.length]);
  }, [reviews]);

  return (
    <section id="reviews" className="section-surface relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
              <Quote className="h-4 w-4" />
              Отзывы
            </div>
            <h2 className="font-days text-3xl tracking-normal sm:text-4xl md:text-5xl">Отзывы клиентов</h2>
          </div>
        </div>

        {loopedReviews.length ? (
          /* Горизонтальная прокрутка отзывов с кастомным scrollbar */
          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max gap-3">
              {loopedReviews.map((review, index) => (
                <article
                  key={`${review.id}-${index}`}
                  className="w-[82%] sm:w-[48%] lg:w-[31%]"
                >
                  <div className="pixel-border animated-card h-full rounded-3xl border border-black/10 bg-black/[0.035] p-4 transition hover:border-blue-500/50 hover:shadow-blue dark:border-white/10 dark:bg-white/[0.045] sm:p-5">
                    <Quote className="h-7 w-7 text-blue-500" />
                    <p className="mt-4 min-h-24 text-sm leading-6 text-black/70 dark:text-white/70">{review.text}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-4 dark:border-white/10">
                      <h3 className="font-days text-lg tracking-normal">{review.clientName}</h3>
                      {review.rating ? (
                        <div className="flex gap-1 text-yellow-400">
                          {Array.from({ length: Math.min(review.rating, 5) }).map((_, starIndex) => (
                            <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-500/30 bg-blue-500/[0.08] p-8 text-center text-black/60 dark:text-white/60">
            Отзывы скоро появятся.
          </div>
        )}
      </div>
    </section>
  );
}
