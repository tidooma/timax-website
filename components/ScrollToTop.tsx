"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER_SCROLL = 360;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Наверх"
          title="Наверх"
          initial={{ opacity: 0, scale: 0.82, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: 12 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-[rgba(10,10,15,0.8)] text-blue-100 shadow-[0_0_18px_rgba(59,130,246,0.12)] backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-blue-400/60 hover:shadow-[0_0_26px_rgba(59,130,246,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
        >
          <ArrowUp aria-hidden="true" size={22} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
