/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "mine-shaft": {
        50: "#f6f6f6",
        100: "#e7e7e7",
        200: "#d1d1d1",
        300: "#b0b0b0",
        400: "#888888",
        500: "#6d6d6d",
        600: "#5d5d5d",
        700: "#4f4f4f",
        800: "#454545",
        900: "#333333",
        950: "#262626",
      },
      "waikawa-gray": {
        50: "#f2f7fb",
        100: "#e7f0f8",
        200: "#d3e2f2",
        300: "#b9cfe8",
        400: "#9cb6dd",
        500: "#839dd1",
        600: "#6a7fc1",
        700: "#6374ae",
        800: "#4a5989",
        900: "#414e6e",
        950: "#262c40",
      },
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
