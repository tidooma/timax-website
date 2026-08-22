"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] text-white">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(37,99,235,0.12), rgba(5,5,7,0.88) 52%, rgba(5,5,7,1) 100%)",
          backgroundSize: "150% 150%"
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative mb-6"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-blue-500/40 blur-[50px]"
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.18, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <Image
            src="/images/bear-logo.png"
            alt="Timax bear"
            width={160}
            height={160}
            className="relative h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-40 md:w-40"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-days text-[5rem] leading-none tracking-tight text-white sm:text-[7rem] md:text-9xl"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 font-days text-3xl tracking-normal text-white sm:text-4xl md:text-5xl"
        >
          Упс! Страница не найдена
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg"
        >
          Похоже, ты заблудился. Давай вернёмся на главную!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="button-outline tech-button inline-flex items-center justify-center rounded-full bg-blue-500 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 sm:px-8"
          >
            Вернуться на главную
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6"
        >
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-xs text-white/45 transition-colors duration-200 hover:text-white/70 sm:text-sm"
          >
            Или посмотри наши работы <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
