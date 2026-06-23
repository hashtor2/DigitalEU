/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f9f7f2',
        terracotta: '#c17a5c',
        navy: '#1a2332',
        forest: '#2d3e2d',
      },
    },
  },
  plugins: [],
}
