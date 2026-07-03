import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#070F2B", // Deepest background
        navyLight: "#1B2A4A", // For cards
        stcBlue: "#3B82F6",
        stcCyan: "#06B6D4",
        stcOrange: "#F97316",
        stcYellow: "#FACC15",
        stcGreen: "#22C55E",
        stcPurple: "#A855F7"
      },
      boxShadow: {
        glow: "0 0 20px rgba(37, 99, 235, 0.5)",
        glowOrange: "0 0 20px rgba(249, 115, 22, 0.5)",
        glowGreen: "0 0 20px rgba(34, 197, 94, 0.5)",
        glowPurple: "0 0 20px rgba(168, 85, 247, 0.5)",
        glowBlue: "0 0 20px rgba(59, 130, 246, 0.5)"
      }
    }
  },
  plugins: []
};

export default config;
