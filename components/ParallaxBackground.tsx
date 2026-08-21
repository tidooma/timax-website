"use client";

import { useScroll, useTransform } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

type ParallaxBackgroundProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

/**
 * Компонент с параллакс-эффектом для фона
 * Фон движется медленнее контента при скролле
 * Скорость: 0.5 от скорости скролла (по умолчанию)
 */
export function ParallaxBackground({ children, className = "", speed = 0.5 }: ParallaxBackgroundProps) {
  const { scrollY } = useScroll();
  
  // Параллакс для фона - движется медленнее контента
  const y = useTransform(scrollY, [0, 1000], [0, 200 * speed]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Вспомогательный компонент motion.div для использования в других местах
import { motion } from "framer-motion";

const motionDiv = motion.div;
export { motionDiv as motion };
