/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#cf611dff",
        secondary: "#7a2f00ff",
        bgcolor: "#ffcaa9ff",
      },
      fontSize: {
        xxs: "0.7rem",   // 9.6px
        xxxs: "0.5rem",  // 8px
      }
    },
  },
  plugins: [],
};
