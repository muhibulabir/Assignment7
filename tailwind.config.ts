import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-bangla)", "var(--font-latin)", "sans-serif"],
      },
      colors: {
        ink: "#20352c",
        leaf: "#276749",
        mango: "#ef8d32",
        canvas: "#fafcfa",
      },
      boxShadow: {
        card: "0 12px 32px rgba(41, 57, 44, 0.07)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bazardor: {
          primary: "#276749",
          secondary: "#ef8d32",
          accent: "#f3b841",
          neutral: "#20352c",
          "base-100": "#fafcfa",
          "base-200": "#f4f7f4",
          "base-300": "#e1e8e1",
          info: "#3b82a0",
          success: "#34865a",
          warning: "#e9a23b",
          error: "#d35f4b",
        },
      },
    ],
  },
};

export default config;
