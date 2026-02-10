/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"] ,
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
        body: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono]
      },
      colors: {
        brand: {
          indigo: "#4338CA",
          amber: "#F59E0B",
          slate: "#0F172A",
          mist: "#F8FAFC"
        }
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        erudika: {
          "primary": "#4338CA",
          "primary-content": "#EEF2FF",
          "secondary": "#F59E0B",
          "secondary-content": "#3B2F00",
          "accent": "#0EA5E9",
          "neutral": "#0F172A",
          "base-100": "#F8FAFC",
          "base-200": "#E2E8F0",
          "base-300": "#CBD5F5",
          "base-content": "#0F172A",
          "info": "#0EA5E9",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444"
        }
      }
    ]
  }
};
