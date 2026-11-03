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
        // Proxima 1:1 Design Tokens
        canvas: "#0e0f13",
        panel: "#16171f",
        input: "#1a1b24",
        stroke: "#22242f",
        lavender: {
          DEFAULT: "#7892ff",
          hover: "#8fa6ff",
          glow: "rgba(120, 146, 255, 0.25)",
        },
        peach: "#fdba74",
        mint: "#31e3ac",
        crimson: "#ed3a7a",
        pure: "#fcfcfc",
        muted: "#8b8e9d",
        subtle: "#565969",
        // Scramjet High-Performance Tokens
        scram: {
          void: "#0e0f13",
          surface: "#16171f",
          card: "#1a1b24",
          border: "#22242f",
          hover: "#282a38",
          plasma: "#7892ff",
          flare: "#fdba74",
          titanium: "#8b8e9d",
          stark: "#fcfcfc",
        },
      },
      fontFamily: {
        sans: ["Aeonik", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        lavender: "0 0 20px rgba(120, 146, 255, 0.25)",
        plasma: "0 0 20px rgba(120, 146, 255, 0.25)",
        hud: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;

