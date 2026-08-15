import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prospect PAL Design Tokens
        brand: {
          50:  "#f0f9f0",
          100: "#dcf0dc",
          200: "#bce3bc",
          300: "#8fcc8f",
          400: "#5cb05c",
          500: "#3d943d",
          600: "#2d762d",
          700: "#1c5a1c",
          800: "#1a3d1a",
          900: "#143214",
        },
        surface: {
          0:   "#ffffff",
          50:  "#fafaf8",
          100: "#f4f3ef",
          200: "#eceae4",
          300: "#e0ddd6",
        },
        ink: {
          DEFAULT: "#111111",
          secondary: "#4B5563",
          muted: "#9CA3AF",
          subtle: "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 24px rgba(0,0,0,0.10)",
        "btn-brand": "0 2px 8px rgba(28,90,28,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "typing": "typing 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
