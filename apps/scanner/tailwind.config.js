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

        // shadcn/ui tokens
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
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
    },
    },
  },
  plugins: [],
}
