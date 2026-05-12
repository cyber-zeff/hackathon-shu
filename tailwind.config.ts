import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        ink: "#0d0d0d",
        paper: "#faf8f4",
        accent: "#c8a97e",
        "accent-deep": "#a07850",
        muted: "#6b6b6b",
        border: "#e8e3da",
      },
    },
  },
  plugins: [],
};
export default config;
