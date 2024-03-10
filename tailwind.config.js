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
    extend: {
      screens: {
        xmd: "900px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        tsff: {
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
              500: "#195348", // Main primary color
              600: "#2A8977",
              700: "#65b891",
              800: "#93e5ab",
              900: "#DCFAEE",
              DEFAULT: "#195348", // Set default primary color
            },
            secondary: {
              // Set default secondary color
            },
            background: {
              DEFAULT: "#00130E",
            },
          },
        },
      },
    }),
  ],
};
