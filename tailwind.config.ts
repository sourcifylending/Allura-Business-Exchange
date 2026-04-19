import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f5f1",
          100: "#ece7de",
          200: "#d7d0c1",
          300: "#bcb39d",
          400: "#9c917d",
          500: "#7f7566",
          600: "#63594d",
          700: "#4a4138",
          800: "#322c25",
          900: "#1f1b17",
          950: "#120f0c",
        },
        accent: {
          50: "#edf8f2",
          100: "#d7f1e2",
          200: "#b3e4c7",
          300: "#84d0a2",
          400: "#55b978",
          500: "#31985a",
          600: "#257847",
          700: "#1d5d38",
          800: "#17482d",
          900: "#113824",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(18, 15, 12, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
