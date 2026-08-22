import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#0284c7"
        },
        timax: {
          black: "#0A0A0A",
          ink: "#000000",
          panel: "#1A1A1A",
          panelSoft: "#222222",
          blue: "#3B82F6",
          blueSoft: "#93C5FD",
          gray: "#9CA3AF",
          gold: "#FFD700",
          orange: "#FFA500"
        }
      },
      fontFamily: {
        days: ["var(--font-days)", "Arial", "sans-serif"]
      },
      boxShadow: {
        blue: "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)",
        gold: "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)",
        logo: "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)"
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
            "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)"
        },
        ".pixel-border-blue": {
          boxShadow:
            "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)"
        },
        ".pixel-border-gold": {
          boxShadow:
            "0 4px 6px -1px rgba(59,130,246,0.1), 0 2px 4px -1px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.15)"
        }
      });
    })
  ]
};

export default config;
