import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f1a",
        accent: "#7c3aed",
        accentSoft: "#a78bfa"
      }
    }
  },
  plugins: []
};

export default config;
