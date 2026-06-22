import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[class~="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nordic Warmth — Light Mode
        canvas: '#f9f7f2',
        'text-primary': '#2c2520',
        'text-secondary': '#6b6560',
        accent: '#c17a5c',
        'accent-hover': '#a8654a',
        border: '#e8e3da',
        success: '#5a9873',
        warning: '#d9a835',
        error: '#c85553',

        // Dark Mode
        'dark-canvas': '#1a1815',
        'dark-text-primary': '#f5f1ea',
        'dark-text-secondary': '#a89d96',
        'dark-border': '#3a3530',

        // shadcn/ui tokens (mapped to Nordic Warmth)
        primary: '#c17a5c',
        'primary-foreground': '#ffffff',
        secondary: '#e8e3da',
        'secondary-foreground': '#2c2520',
        background: '#f9f7f2',
        foreground: '#2c2520',
        muted: '#6b6560',
        'muted-foreground': '#6b6560',
        input: '#e8e3da',
        ring: '#c17a5c',
        destructive: '#c85553',
        'destructive-foreground': '#ffffff',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '3rem', fontWeight: '600' }],
        'h2': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
      },
      spacing: {
        'gutter': '1rem',
      },
    },
  },
  // Dark mode color mappings
  plugins: [
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '@apply bg-canvas text-text-primary': {},
        },
        '.dark': {
          '@apply bg-dark-canvas text-dark-text-primary': {},
        },
        // Type scale
        'h1': {
          '@apply text-h1 font-mono': {},
        },
        'h2': {
          '@apply text-h2 font-mono': {},
        },
        'h3': {
          '@apply text-h3 font-mono': {},
        },
        'body': {
          '@apply text-body font-sans': {},
        },
        // Form inputs
        'input, textarea': {
          '@apply border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary placeholder-text-secondary dark:placeholder-dark-text-secondary px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent': {},
        },
        // Buttons (base)
        'button': {
          '@apply px-6 py-3 rounded-sm font-semibold text-small transition-colors': {},
          '&.btn-primary': {
            '@apply bg-accent text-white hover:bg-accent-hover': {},
          },
          '&.btn-secondary': {
            '@apply border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary hover:bg-canvas dark:hover:bg-dark-canvas': {},
          },
          '&:disabled': {
            '@apply opacity-50 cursor-not-allowed': {},
          },
        },
      });
    },
  ],
} satisfies Config;
