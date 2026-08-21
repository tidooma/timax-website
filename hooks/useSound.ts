"use client";
import { useCallback } from "react";

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

// Звук клика отключен
export function useClickSound() {
  return useCallback(() => {
    // Звук отключен
  }, []);
}

// Звук успеха отключен
export function useSuccessSound() {
  return useCallback(() => {
    // Звук отключен
  }, []);
}

// Звук ready оставлен как есть
export function useReadySound() {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    readySound = playSound("/sounds/ready.mp3", readySound, 0.3);
  }, []);
}
