"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ServiceCardProps = {
  children: ReactNode;
  className?: string;
  isPopular?: boolean;
};

/**
 * Анимированная карточка услуги с эффектами при hover:
 * - scale 1→1.03
 * - translateY -5px
 * - 3D rotateX эффект (10deg)
 * - Подсветка границ (border glow)
 * - Плавные переходы 0.4s
 */
export function ServiceCard({ children, className = "", isPopular = false }: ServiceCardProps) {
  return (
    <motion.article
      className={`relative overflow-hidden rounded-3xl border p-6 transition-colors ${
        isPopular
          ? "border-blue-500/70 bg-blue-500/[0.12] shadow-blue"
          : "border-black/10 bg-black/[0.035] dark:border-white/10 dark:bg-white/[0.045]"
      } ${className}`}
      whileHover={{
        scale: 1.03,
        y: -5,
        rotateX: 10,
        boxShadow: isPopular
          ? "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 24px rgba(59, 130, 246, 0.2)"
          : "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 24px rgba(59, 130, 246, 0.15)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        willChange: "transform, box-shadow"
      }}
    >
      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: isPopular
            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, transparent 50%, rgba(59, 130, 246, 0.2) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
          opacity: 0
        }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.article>
  );
}
