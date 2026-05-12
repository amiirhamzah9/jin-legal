import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1a4035",
          deep: "#0e2820",
          mid: "#245548",
          hover: "#2d6b5a",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e2c97e",
          pale: "#f5edda",
        },
        ivory: {
          DEFAULT: "#faf7f1",
          dark: "#f0ebe0",
        },
        ink: {
          DEFAULT: "#1a2420",
          muted: "#6b7f78",
          faint: "#a8b8b2",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
