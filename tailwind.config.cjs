/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        "primary":"#191825",
        "secondary": "#865DFF",
        "tertiary-dark":"#865DFF",
        "tertiary-light":"#FFA3FD"
      }
    },
  },
  plugins: [],
};

module.exports = config;
