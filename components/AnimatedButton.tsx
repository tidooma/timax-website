"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

type AnimatedButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  glowColor?: string;
};

/**
 * Кнопка с анимацией при наведении:
 * - scale 1→1.05
 * - glow-эффект (box-shadow с анимацией)
 * - неоновая подсветка (cyan/blue)
 */
export function AnimatedButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  glowColor = "#3B82F6"
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ scale: 1 }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        boxShadow: isHovered
          ? `0 0 24px ${glowColor}, 0 0 48px ${glowColor}44`
          : "0 0 0 rgba(0,0,0,0)"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        willChange: "transform, box-shadow"
      }}
    >
      {children}
    </motion.button>
  );
}
