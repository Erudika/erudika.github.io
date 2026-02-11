/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"] ,
  theme: {
    extend: {
      fontFamily: {
        heading: ["Rubik", ...defaultTheme.fontFamily.sans],
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
          "primary": "#3399CC",
          "primary-content": "#FFFFFF",
          "secondary": "#F59E0B",
          "secondary-content": "#3B2F00",
          "accent": "#3399CC",
          "neutral": "#0F172A",
          "base-100": "#F8FAFC",
          "base-200": "#E2E8F0",
          "base-300": "#CBD5F5",
          "base-content": "#0F172A",
          "info": "#0EA5E9",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
          "--rounded-box": "3px",
          "--rounded-btn": "3px",
          "--rounded-badge": "3px"
        }
      },
      {
        "erudika-dark": {
          "primary": "#3399CC",
          "primary-content": "#FFFFFF",
          "secondary": "#FBBF24",
          "secondary-content": "#3B2F00",
          "accent": "#3399CC",
          "neutral": "#0F172A",
          "base-100": "#0B1220",
          "base-200": "#111827",
          "base-300": "#1F2937",
          "base-content": "#E2E8F0",
          "info": "#38BDF8",
          "success": "#22C55E",
          "warning": "#FBBF24",
          "error": "#F87171",
          "--rounded-box": "3px",
          "--rounded-btn": "3px",
          "--rounded-badge": "3px"
        }
      }
    ]
  }
};
