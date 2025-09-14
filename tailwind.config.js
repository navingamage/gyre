/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#0b3d3a",
        kelp: "#146b5c",
        foam: "#eef7f4",
        coral: "#e8604c",
      },
    },
  },
  plugins: [],
};
