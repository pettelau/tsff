import { nextui } from "@nextui-org/react";
import colors from "./colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
      
    },
    extend: {
      screens: {
        xs: "500px",
        xmd: "900px",
      },
      colors: colors,
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        tsff: {
          colors: colors,
        },
      },
    }),
  ],
};
