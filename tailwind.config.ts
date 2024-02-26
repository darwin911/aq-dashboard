import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        good: "#00e400",
        moderate: "#ffff00",
        "unhealthy-for-sensitive-groups": "#ff7e00",
        unhealthy: "#ff0000",
        "very-unhealthy": "#8f3f97",
        hazardous: "#7e0023",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-good",
    "bg-moderate",
    "bg-unhealthy-for-sensitive-groups",
    "bg-unhealthy",
    "bg-very-unhealthy",
    "bg-hazardous",
  ],
};
export default config;
