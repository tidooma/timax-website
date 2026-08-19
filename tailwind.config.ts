import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        timax: {
          black: "#0A0A0A",
          ink: "#000000",
          panel: "#1A1A1A",
          panelSoft: "#222222",
          blue: "#3B82F6",
          blueSoft: "#60A5FA",
          gray: "#9CA3AF",
          gold: "#FFD700",
          orange: "#FFA500"
        }
      },
      fontFamily: {
        days: ["var(--font-days)", "Arial", "sans-serif"]
      },
      boxShadow: {
        blue: "0 12px 28px rgba(29, 161, 242, 0.18), 0 0 18px rgba(59, 130, 246, 0.14)",
        gold: "0 12px 30px rgba(255, 215, 0, 0.18), 0 0 18px rgba(255, 215, 0, 0.22)",
        logo: "0 8px 18px rgba(29, 161, 242, 0.16)"
      },
      backgroundImage: {
        "pixel-grid":
          "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".pixel-border": {
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 12px 28px rgba(15,23,42,0.07), 0 0 16px rgba(59,130,246,0.1)"
        },
        ".pixel-border-blue": {
          boxShadow:
            "0 0 0 1px rgba(96,165,250,0.42), 0 14px 32px rgba(59,130,246,0.16), 0 0 18px rgba(96,165,250,0.18)"
        },
        ".pixel-border-gold": {
          boxShadow:
            "0 0 0 1px rgba(255,215,0,0.48), 0 14px 32px rgba(255,165,0,0.12), 0 0 18px rgba(255,215,0,0.18)"
        }
      });
    })
  ]
};

export default config;
