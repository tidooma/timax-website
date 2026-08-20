"use client";

import { BadgeCheck, Sparkles } from "lucide-react";
import { useClickSound } from "@/hooks/useSound";
import type { ServiceDTO } from "@/lib/types";

type ServicesProps = {
  services: ServiceDTO[];
  onOpenOrder: (videoType?: string) => void;
};

function resolveOrderPreset(serviceTitle: string) {
  const normalized = serviceTitle.toLowerCase();

  if (normalized.includes("youtube") || normalized.includes("insta") || normalized.includes("tiktok")) {
    return "YouTube / TikTok / Instagram* (короткое видео до 60 сек)";
  }

  if (normalized.includes("реклам") || normalized.includes("ads") || normalized.includes("сайт")) {
    return "Рекламный ролик";
  }

  return "Длинное видео (YouTube, подкаст и т.д.)";
}

export function Services({ services, onOpenOrder }: ServicesProps) {
  const playClick = useClickSound();

  return (
    <section id="services" className="section-surface relative scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300">
            <BadgeCheck className="h-4 w-4" />
            Цены
          </div>
          <h2 className="font-days text-4xl tracking-normal md:text-6xl">Услуги и цены</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                playClick();
                onOpenOrder(resolveOrderPreset(service.title));
              }}
              className={`service-card tech-panel animated-card liquid-glass relative block w-full overflow-hidden rounded-[1.75rem] p-6 text-left transition-[transform,border-color,background-color,box-shadow] duration-500 ease-out hover:border-blue-500/40 hover:shadow-blue ${
                service.isPopular
                  ? "border-blue-500/40 bg-[linear-gradient(180deg,rgba(37,99,235,0.12),rgba(9,11,17,0.9))]"
                  : "bg-[linear-gradient(180deg,rgba(15,23,42,0.7),rgba(9,10,15,0.92))]"
              }`}
            >
              {service.isPopular ? (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 text-xs font-bold text-white shadow-blue">
                  <Sparkles className="h-4 w-4" />
                  Популярный
                </div>
              ) : (
                <div className="mb-5 h-9" />
              )}
              <h3 className="font-days text-2xl tracking-normal">{service.title}</h3>
              <p className="mt-4 min-h-24 text-sm leading-7 text-slate-300">{service.description}</p>
              <div className="service-price mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4 font-days text-2xl tracking-normal text-blue-300 transition-transform duration-500 ease-out">
                {service.price}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
