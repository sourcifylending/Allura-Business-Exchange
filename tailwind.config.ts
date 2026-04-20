import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#121417",
          100: "#181b1f",
          200: "#242930",
          300: "#343b44",
          400: "#4a545e",
          500: "#68727d",
          600: "#929ba5",
          700: "#b7bec5",
          800: "#d7dde2",
          900: "#eef1f4",
          950: "#fbfcfd",
        },
        accent: {
          50: "#2c2416",
          100: "#3a2f1a",
          200: "#544021",
          300: "#71552b",
          400: "#93703a",
          500: "#b78b47",
          600: "#cf9f55",
          700: "#e0b96e",
          800: "#edd09a",
          900: "#f7e7c4",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
