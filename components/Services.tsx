"use client";

import { BadgeCheck, Sparkles } from "lucide-react";
import type { ServiceDTO } from "@/lib/types";
import { ServiceCard } from "@/components/ServiceCard";
import { AnimatedSection } from "@/components/AnimatedSection";

type ServicesProps = {
  services: ServiceDTO[];
  onOpenOrder: (videoType: string) => void;
};

export function Services({ services, onOpenOrder }: ServicesProps) {
  return (
    <AnimatedSection id="services" className="section-surface relative scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
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
            <ServiceCard
              key={service.id}
              isPopular={service.isPopular}
              onClick={() => onOpenOrder(service.title)}
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
            </ServiceCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
