"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Компонент для плавного появления секций при скролле
 * Использует useInView из react-intersection-observer
 * Анимация: opacity 0→1, translateY 30px→0
 */
export function AnimatedSection({ children, className = "", delay = 0, id }: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true, // Анимируем только один раз
    threshold: 0.1, // Срабатывает когда 10% элемента видно
    rootMargin: "50px" // Запас в 50px до того как элемент появится
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        delay
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
