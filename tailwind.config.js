/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: { brand: "#1a1a2e", accent: "#16a34a" },
        boxShadow: { soft: "0 8px 24px rgba(0,0,0,.08)" },
      },
    },
    plugins: [],
  }
  