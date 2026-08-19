"use client";

import { useState } from "react";
import { ExpressOrderForm } from "@/components/ExpressOrderForm";
import { Footer } from "@/components/Footer";
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

  return (
    <div className="pixel-page relative min-h-screen overflow-x-hidden text-white">
      <Navbar onOrderOpen={() => setIsOrderOpen(true)} />
      <Hero onOrderOpen={() => setIsOrderOpen(true)} />
      <Portfolio editors={data.editors} />
      <Services services={data.services} />
      <Reviews reviews={data.reviews} />
      <Footer />
      <ExpressOrderForm open={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </div>
  );
}
