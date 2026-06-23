/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#f9f7f2',
        'cream-dark': '#1a1815',
        terracotta: '#c17a5c',
        'terracotta-dark': '#a86650',
        navy: '#1a2332',
        forest: '#2d3e2d',
        'text-primary-dark': '#f5f1ea',
        'text-secondary-dark': '#a89d96',
        'border-dark': '#3a3530',
      },
    },
  },
  plugins: [],
}
