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
        scram: {
          void: "#08090C",
          surface: "#0D1117",
          card: "#121721",
          border: "#1C2533",
          hover: "#222D3D",
          plasma: "#FF3E00",
          flare: "#FF7700",
          titanium: "#8E9AA8",
          stark: "#F8FAFC",
        },
      },
      fontFamily: {
        ioskeley: ["var(--font-ioskeley)", "Cabinet Grotesk", "-apple-system", "sans-serif"],
        anonymous: ["var(--font-anonymous)", "Courier New", "monospace"],
      },
      boxShadow: {
        plasma: "0 0 25px -5px rgba(255, 62, 0, 0.35)",
        hud: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
