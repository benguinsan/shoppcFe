/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#1846be",
      },
      backgroundImage: {
        laptop_gaming: "url('./public/images/bg-laptop.png')",
        laptop: "url('./public/images/bg-laptop-1.png')",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
