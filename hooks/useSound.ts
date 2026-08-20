"use client";

import { useCallback } from "react";

let clickSound: HTMLAudioElement | null = null;
let successSound: HTMLAudioElement | null = null;
let readySound: HTMLAudioElement | null = null;

function playSound(source: string, currentSound: HTMLAudioElement | null, volume: number) {
  if (typeof window === "undefined") return currentSound;

  const sound = currentSound ?? new Audio(source);
  sound.preload = "auto";
  sound.volume = volume;
  sound.currentTime = 0;
  void sound.play().catch(() => undefined);
  return sound;
}

export function useClickSound() {
  return useCallback(() => {
    if (typeof window === "undefined") return;

    clickSound = playSound("/sounds/success.mp3", clickSound, 0.12);
  }, []);
}

export function useSuccessSound() {
  return useCallback(() => {
    successSound = playSound("/sounds/success.mp3", successSound, 0.25);
  }, []);
}

export function useReadySound() {
  return useCallback(() => {
    readySound = playSound("/sounds/ready.mp3", readySound, 0.3);
  }, []);
}
