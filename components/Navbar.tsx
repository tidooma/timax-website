"use client";

import { Menu, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TimaxLogo } from "@/components/TimaxLogo";
import { WalkingBear } from "@/components/WalkingBear";
import { useClickSound } from "@/hooks/useSound";

const navItems = [
  { label: "Портфолио", id: "portfolio" },
  { label: "Услуги", id: "services" },
  { label: "Отзывы", id: "reviews" },
  { label: "Контакты", id: "contacts" }
];

type NavbarProps = {
  onOrderOpen: () => void;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar({ onOrderOpen }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("portfolio");
  const playClick = useClickSound();
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const ignoreClickRef = useRef(false);

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.4, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function handleNav(id: string) {
    setMobileOpen(false);
    playClick();
    scrollToSection(id);
  }

  function handleMouseDown(event: React.MouseEvent<HTMLButtonElement>) {
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    ignoreClickRef.current = false;
  }

  function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
    if (!dragStartRef.current) return;

    const deltaX = Math.abs(event.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(event.clientY - dragStartRef.current.y);

    if (Math.max(deltaX, deltaY) > 5) {
      ignoreClickRef.current = true;
    }
  }

  function handleMouseUp(event: React.MouseEvent<HTMLButtonElement>) {
    if (ignoreClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }

    dragStartRef.current = null;
  }

  function handleNavClick(id: string, event: React.MouseEvent<HTMLButtonElement>) {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    handleNav(id);
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-[80] w-full border-b border-blue-500/25 bg-[#070a10]/70 backdrop-blur-md sm:backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:min-h-[4.75rem] sm:px-6 sm:py-3 lg:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="inline-flex min-w-0 items-center gap-2 text-white transition-transform hover:scale-[1.01] hover:text-blue-400 sm:gap-3"
          aria-label="Timax"
        >
          <WalkingBear />
          <TimaxLogo compact />
        </button>

        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex" aria-label="Главное меню">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  dragStartRef.current = null;
                  ignoreClickRef.current = false;
                }}
                onClick={(event) => handleNavClick(item.id, event)}
                className={`group relative cursor-pointer overflow-hidden pb-1 text-[0.8125rem] font-medium tracking-[0.02em] uppercase transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="relative inline-flex items-center">
                  {item.label}
                  <span
                    className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full transition-all duration-200 ${
                      isActive ? "bg-blue-500" : "bg-blue-500 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => {
              playClick();
              onOrderOpen();
            }}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-500 px-5 text-sm font-bold text-white shadow-blue transition hover:scale-[1.02] hover:bg-blue-400"
          >
            <Send className="h-4 w-4" />
            Экспресс заказ
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Открыть меню"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:border-blue-500/50 sm:h-11 sm:w-11 sm:rounded-2xl"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 top-0 z-50 bg-black/50 backdrop-blur-[2px] lg:hidden">
          <aside className="mobile-menu-panel ml-auto flex h-dvh w-[min(22rem,calc(100vw-1rem))] flex-col gap-5 border-l border-blue-500/25 bg-[#080808] p-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:p-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex min-w-0 items-center gap-2 sm:gap-3">
                <WalkingBear />
                <TimaxLogo compact />
              </div>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left font-semibold transition-colors hover:border-blue-500/45"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                playClick();
                onOrderOpen();
              }}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 font-bold text-white shadow-blue"
            >
              <Send className="h-5 w-5" />
              Экспресс заказ
            </button>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
