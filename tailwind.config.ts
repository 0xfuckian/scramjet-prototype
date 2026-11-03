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
        // Scramjet Hypersonic Plasma Theme Tokens
        canvas: "#08090C",
        panel: "#0D1117",
        input: "#121721",
        stroke: "#1C2533",
        plasma: {
          DEFAULT: "#FF3E00",
          hover: "#FF5500",
          glow: "rgba(255, 62, 0, 0.35)",
        },
        flare: "#FF7700",
        mint: "#31e3ac",
        crimson: "#FF2A55",
        pure: "#F8FAFC",
        muted: "#8E9AA8",
        subtle: "#4A5568",
        scram: {
          void: "#08090C",
          surface: "#0D1117",
          card: "#121721",
          border: "#1C2533",
          hover: "#1A2230",
          plasma: "#FF3E00",
          flare: "#FF7700",
          titanium: "#8E9AA8",
          stark: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["Aeonik", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        plasma: "0 0 25px -5px rgba(255, 62, 0, 0.4)",
        hud: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;


