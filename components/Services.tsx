"use client";

import { BadgeCheck, Sparkles } from "lucide-react";
import type { ServiceDTO } from "@/lib/types";

type ServicesProps = {
  services: ServiceDTO[];
};

export function Services({ services }: ServicesProps) {
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
            <article
              key={service.id}
              className={`pixel-border animated-card liquid-glass relative overflow-hidden rounded-3xl border p-6 transition ${
                service.isPopular
                  ? "border-blue-500/70 bg-blue-500/[0.12] shadow-blue"
                  : "border-black/10 bg-black/[0.035] dark:border-white/10 dark:bg-white/[0.045]"
              }`}
            >
              {service.isPopular ? (
                <div className="mb-5 inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-3 py-2 text-xs font-bold text-white shadow-blue">
                  <Sparkles className="h-4 w-4" />
                  Популярный
                </div>
              ) : (
                <div className="mb-5 h-9" />
              )}
              <h3 className="font-days text-2xl tracking-normal">{service.title}</h3>
              <p className="mt-4 min-h-24 text-sm leading-7 text-black/60 dark:text-white/60">{service.description}</p>
              <div className="mt-6 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-4 py-4 font-days text-2xl tracking-normal text-blue-600 dark:text-blue-300">
                {service.price}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
