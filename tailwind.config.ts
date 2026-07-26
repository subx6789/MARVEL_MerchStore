// ─────────────────────────────────────────────────────────
// MARVEL MerchStore — Tailwind CSS Configuration
// Design System Tokens
// ─────────────────────────────────────────────────────────
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MARVEL Brand Colors
        marvel: {
          red: "#E23636",
          "red-dark": "#B01D1D",
          "red-light": "#FF5252",
          gold: "#F0B429",
          "gold-dark": "#C8941A",
          "gold-light": "#FFD166",
          black: "#0A0A0A",
          "black-soft": "#111111",
          "black-card": "#161616",
          "black-border": "#1E1E1E",
          "black-hover": "#242424",
          white: "#F5F5F0",
          "white-dim": "#C8C8C0",
          "white-muted": "#888880",
        },
        // Semantic
        background: "#0A0A0A",
        foreground: "#F5F5F0",
        border: "#1E1E1E",
        muted: "#888880",
        accent: "#E23636",
      },
      fontFamily: {
        // Display — Bebas Neue (hero/display text)
        display: ["var(--font-bebas)", "sans-serif"],
        // Body — Inter (UI text)
        sans: ["var(--font-inter)", "sans-serif"],
        // Mono
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "hero-xl": ["clamp(5rem,10vw,10rem)", { lineHeight: "0.9" }],
        "hero-lg": ["clamp(3.5rem,7vw,7rem)", { lineHeight: "0.95" }],
        "hero-md": ["clamp(2.5rem,5vw,5rem)", { lineHeight: "1" }],
        "display-sm": ["clamp(1.8rem,3vw,3rem)", { lineHeight: "1.05" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
        "card": "2rem",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "6px",
        xl: "8px",
        "2xl": "12px",
      },
      boxShadow: {
        "marvel": "0 0 0 1px #E23636",
        "gold": "0 0 0 1px #F0B429",
        "card": "0 4px 24px rgba(0,0,0,0.6)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px #E23636",
        "glow-red": "0 0 30px rgba(226,54,54,0.3)",
        "glow-gold": "0 0 30px rgba(240,180,41,0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "ticker": "ticker 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-marvel":
          "linear-gradient(135deg, #E23636 0%, #B01D1D 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #F0B429 0%, #C8941A 100%)",
        "gradient-dark":
          "linear-gradient(180deg, #111111 0%, #0A0A0A 100%)",
        "gradient-card":
          "linear-gradient(145deg, #161616 0%, #111111 100%)",
        "shimmer-bg":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
