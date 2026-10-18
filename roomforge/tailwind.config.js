/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fbfaf8',
          100: '#f8f7f4',
          200: '#f0ede6',
          300: '#e5e0d5',
          400: '#d1c9b8',
          500: '#b8ad96',
        },
        sage: {
          50: '#f4f6f4',
          100: '#e6ebe6',
          200: '#cad5ca',
          300: '#9fb5a0',
          400: '#718675',
          500: '#5d7563',
          600: '#485e4e',
          700: '#3a4a3e',
          800: '#2d3a30',
          900: '#1c251f',
        },
        clay: {
          50: '#fbf6f2',
          100: '#f6ece2',
          200: '#ecd7c3',
          300: '#debe9f',
          400: '#c89d74',
          500: '#b88c61',
          600: '#a3744c',
          700: '#855938',
        },
        forest: '#2d3a30',
        charcoal: '#1c201d',
        muted: '#76877a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
