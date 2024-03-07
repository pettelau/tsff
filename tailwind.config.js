import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
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
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "tsff": {
          // Name your theme as desired
          extend: "dark", // Inherit from the dark theme
          colors: {
            // Add other colors as needed
            primary: {
              50: "#E6EFFB",
              100: "#C2D6F7",
              200: "#9EBDF3",
              300: "#7BA4EF",
              400: "#577BEA",
              500: "#0F2443", // Main primary color
              600: "#0D1E36",
              700: "#0B1829",
              800: "#09121C",
              900: "#070C0F",
              DEFAULT: "#0F2443", // Set default primary color
            },
            secondary: {
              50: "#FDE6E5",
              100: "#FBC6C4",
              200: "#F9A6A3",
              300: "#F78682",
              400: "#F56661",
              500: "#CB4443", // Main secondary color
              600: "#B33C3B",
              700: "#9B3433",
              800: "#832C2B",
              900: "#6B2423",
              DEFAULT: "#CB4443", // Set default secondary color
            },
            // Define other theme properties as needed
          },
        },
      },
    }),
  ],
};
