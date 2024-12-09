/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        secundaria: {
          DEFAULT: "#0fbcf9",
          50: "#effaff",
          100: "#dff4ff",
          200: "#b8ebff",
          300: "#78dcff",
          400: "#31caff",
          500: "#0fbcf9",
          600: "#0090ce",
          700: "#0073a7",
          800: "#02618a",
          900: "#085072",
          950: "#06324b",
        },
        primaria: "#ffffff",
        terceira: "#f5a623",
        quarta: "#4caf50",
        quinta: "#6d6d6d",
        sexta: "#ff6f61",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
