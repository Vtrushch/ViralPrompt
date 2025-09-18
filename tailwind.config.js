/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5D5FEF",
        title: "#2B2D42",
        body: "#4B5563",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
        glow: "0 10px 40px rgba(93,95,239,0.35)"
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
