"use client";

import Lottie from "lottie-react";

const glowAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 280,
  h: 280,
  nm: "timax-gold-glow",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "золотое сияние",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [18], e: [58], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
            { t: 45, s: [58], e: [18], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
            { t: 90, s: [18] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [140, 140, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [82, 82, 100], e: [116, 116, 100], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
            { t: 45, s: [116, 116, 100], e: [82, 82, 100], i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] } },
            { t: 90, s: [82, 82, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [190, 190] }, p: { a: 0, k: [0, 0] }, nm: "круг" },
            { ty: "fl", c: { a: 0, k: [1, 0.79, 0, 1] }, o: { a: 0, k: 72 }, r: 1, bm: 0, nm: "заливка" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "сияние"
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

export function GoldenBucket() {
  return (
    <div
      className="golden-bucket-float relative mx-auto h-64 w-64 md:h-80 md:w-80"
      aria-hidden="true"
    >
      <Lottie animationData={glowAnimation} loop autoplay className="absolute inset-0 opacity-80" />
      <div className="bucket-glow absolute inset-8 overflow-hidden rounded-[2rem]">
        <div className="bucket-shimmer absolute inset-y-8 left-0 z-20 h-[70%] w-16 rotate-12 bg-white/40 blur-md" />
        <svg viewBox="0 0 260 260" className="relative z-10 h-full w-full" role="img">
          <defs>
            <linearGradient id="bucketGold" x1="60" x2="205" y1="38" y2="218" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF4A3" />
              <stop offset="0.45" stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFA500" />
            </linearGradient>
            <linearGradient id="bucketShade" x1="80" x2="190" y1="86" y2="206" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF7BF" stopOpacity="0.88" />
              <stop offset="1" stopColor="#B86F00" stopOpacity="0.42" />
            </linearGradient>
          </defs>
          <path
            d="M72 102c7 72 16 112 24 122 8 9 60 9 68 0 8-10 17-50 24-122H72Z"
            fill="url(#bucketGold)"
            stroke="#FFF1A6"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M63 98c0-15 30-28 67-28s67 13 67 28-30 28-67 28-67-13-67-28Z"
            fill="#FFE875"
            stroke="#FFF6BD"
            strokeWidth="8"
          />
          <path
            d="M89 95c5-36 24-56 41-56s36 20 41 56"
            fill="none"
            stroke="#FFD95E"
            strokeLinecap="round"
            strokeWidth="13"
          />
          <path
            d="M102 130h56M99 158h62M107 187h46"
            stroke="url(#bucketShade)"
            strokeLinecap="round"
            strokeWidth="11"
          />
          <path d="M155 78c18 3 31 11 31 20 0 11-25 20-56 20" fill="none" stroke="#FFEFA3" strokeLinecap="round" strokeWidth="9" opacity="0.72" />
        </svg>
      </div>
    </div>
  );
}
