"use client";

import { useState } from "react";
import { ExpressOrderForm } from "@/components/ExpressOrderForm";
import { Footer } from "@/components/Footer";
import { CustomSectionsFeed } from "@/components/CustomSectionsFeed";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Portfolio } from "@/components/Portfolio";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import type { PublicDataDTO } from "@/lib/types";

type SiteShellProps = {
  data: PublicDataDTO;
};

export function SiteShell({ data }: SiteShellProps) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [defaultVideoType, setDefaultVideoType] = useState("");

  function openOrderForm(videoType?: string) {
    setDefaultVideoType(videoType ?? "");
    setIsOrderOpen(true);
  }

  function closeOrderForm() {
    setIsOrderOpen(false);
    setDefaultVideoType("");
  }

  return (
    <div className="pixel-page relative min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),rgba(5,5,7,0.88)_52%,rgba(5,5,7,1)_100%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='rgba(96,165,250,0.04)'/%3E%3C/svg%3E\")",
          backgroundSize: "4px 4px"
        }}
      />
      <div className="relative z-10">
        <Navbar onOrderOpen={() => openOrderForm()} />
        <Hero onOrderOpen={() => openOrderForm()} banner={data.banner} />
        <Portfolio editors={data.editors} />
        <Services
          services={data.services}
          onOpenOrder={(videoType) => {
            openOrderForm(videoType);
          }}
        />
        <Reviews reviews={data.reviews} />
        <CustomSectionsFeed sections={data.sections} />
        <Footer />
        <ExpressOrderForm key={`${isOrderOpen}-${defaultVideoType}`} open={isOrderOpen} onClose={closeOrderForm} defaultVideoType={defaultVideoType} />
      </div>
    </div>
  );
}
