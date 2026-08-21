"use client";

import { SafeLogoImage } from "@/components/SafeLogoImage";
import type { CustomSectionDTO } from "@/lib/types";

type CustomSectionsFeedProps = {
  sections: CustomSectionDTO[];
};

export function CustomSectionsFeed({ sections }: CustomSectionsFeedProps) {
  const visibleSections = sections.filter((section) => {
    const normalizedTitle = section.title.toLowerCase();
    return !normalizedTitle.includes("новост") && !normalizedTitle.includes("news") && Boolean(section.cards.length || section.description);
  });

  if (!visibleSections.length) return null;

  return (
    <section id="feed" className="section-surface relative scroll-mt-24 overflow-visible px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {visibleSections.map((section) => (
          <div key={section.id} className="mb-16 last:mb-0">
            <div className="mb-8">
              <h2 className="font-days text-3xl tracking-normal sm:text-4xl md:text-5xl">{section.title}</h2>
              {section.description ? <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">{section.description}</p> : null}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card) => {
                const content = (
                  <>
                    {card.imageUrl ? <SafeLogoImage sources={[card.imageUrl]} alt="" className="aspect-video w-full rounded-2xl object-cover" loading="lazy" /> : null}
                    <div className="pt-4">
                      <h3 className="font-days text-xl tracking-normal">{card.title}</h3>
                      {card.subtitle ? <p className="mt-2 text-sm font-semibold text-blue-300">{card.subtitle}</p> : null}
                      {card.description ? <p className="mt-3 text-sm leading-6 text-white/60">{card.description}</p> : null}
                    </div>
                  </>
                );

                return (
                  <article
                    key={card.id}
                    className="rounded-3xl border border-blue-500/15 bg-white/[0.045] p-4"
                  >
                    {card.linkUrl ? <a href={card.linkUrl} target="_blank" rel="noreferrer" className="block">{content}</a> : content}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
