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
        // European Digital — Light Mode (Clean, High-Contrast)
        canvas: '#ffffff',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        accent: '#10b981',
        'accent-hover': '#059669',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',

        // Dark Mode (Rich, Premium)
        'dark-canvas': '#0f172a',
        'dark-text-primary': '#f8fafc',
        'dark-text-secondary': '#cbd5e1',
        'dark-border': '#1e293b',

        // Secondary Accents
        'secondary-accent': '#0ea5e9',
        'secondary-accent-hover': '#0284c7',
        'warm-accent': '#f59e0b',

        // shadcn/ui tokens (mapped to European Digital)
        primary: '#10b981',
        'primary-foreground': '#ffffff',
        secondary: '#0ea5e9',
        'secondary-foreground': '#ffffff',
        background: '#ffffff',
        foreground: '#111827',
        muted: '#6b7280',
        'muted-foreground': '#6b7280',
        input: '#f3f4f6',
        ring: '#10b981',
        destructive: '#ef4444',
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
