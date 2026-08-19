"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import type { ReactNode, SyntheticEvent } from "react";
import { useState } from "react";

type SafeLogoImageProps = {
  sources: string[];
  alt: string;
  className?: string;
  fallback?: ReactNode;
  fetchPriority?: "auto" | "high" | "low";
  height?: number;
  sizes?: string;
  srcSet?: string;
  loading?: "eager" | "lazy";
  optimized?: boolean;
  priority?: boolean;
  width?: number;
};

export function SafeLogoImage({
  sources,
  alt,
  className = "",
  fallback = null,
  fetchPriority = "auto",
  height,
  loading = "lazy",
  optimized = false,
  priority = false,
  sizes,
  srcSet,
  width
}: SafeLogoImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];

  function handleError() {
    setSourceIndex((index) => index + 1);
  }

  function preventDrag(event: SyntheticEvent<HTMLImageElement>) {
    event.preventDefault();
  }

  if (!src) return fallback;

  if (optimized && width && height && !src.endsWith(".svg")) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`site-logo-media ${className}`}
        draggable={false}
        loading={priority ? undefined : loading}
        priority={priority}
        sizes={sizes}
        onDragStart={preventDrag}
        onError={handleError}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`site-logo-media ${className}`}
      draggable={false}
      fetchPriority={fetchPriority}
      loading={loading}
      decoding="async"
      sizes={sizes}
      srcSet={srcSet}
      onDragStart={preventDrag}
      onError={handleError}
    />
  );
}
