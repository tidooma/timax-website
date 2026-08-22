"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

/**
 * Компонент анимированного фона с плавающими частицами
 * - Градиентный фон с плавной анимацией
 * - Плавающие частицы которые медленно двигаются и мерцают
 */
export function AnimatedBackground() {
  const [particles] = useState<Particle[]>(() => Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2
    })));

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Анимированный градиентный фон */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity
        }}
        style={{
          background: "linear-gradient(-45deg, #06070b, #090d15, #0a0f1a, #06070b)",
          backgroundSize: "400% 400%"
        }}
      />

      {/* Плавающие частицы */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [particle.opacity, particle.opacity + 0.3, particle.opacity]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
