import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[class~="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;
