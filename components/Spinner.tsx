"use client";

import { motion } from "framer-motion";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  color?: string;
};

/**
 * Компонент спиннера для загрузки
 * Используется при отправке заявки
 */
export function Spinner({ size = "md", color = "#3B82F6" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <motion.div
      className={sizeClasses[size]}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        border: `2px solid ${color}22`,
        borderTopColor: color,
        borderRadius: "50%"
      }}
    />
  );
}

type SuccessCheckProps = {
  size?: "sm" | "md" | "lg";
  color?: string;
};

/**
 * Компонент галочки успешной отправки
 */
export function SuccessCheck({ size = "md", color = "#10B981" }: SuccessCheckProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <motion.svg
      className={sizeClasses[size]}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
