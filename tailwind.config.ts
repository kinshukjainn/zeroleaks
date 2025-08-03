import { type Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class", ".dark"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
      lineHeight: {
        12: "3rem",
        16: "4rem",
      },
      borderWidth: {
        3: "3px",
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "borderPulse": "borderPulse 4s linear infinite", // NEW
      },
      keyframes: {
        borderPulse: {
          "0%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0% 50%",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.3)",
      },
      backgroundSize: {
        '200': '200% 200%', // Optional helper class `bg-200`
      },
    },
  },
  plugins: [],
}

export default config
