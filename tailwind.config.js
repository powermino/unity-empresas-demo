/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#030817', 900: '#050d24', 800: '#0a1638', 700: '#10204d', 600: '#18306b' },
        electric: { DEFAULT: '#1f6bff', 400: '#4a8bff', 300: '#7aaaff', glow: '#3ad0ff' },
        mist: { 50: '#f6f8fc', 100: '#eef2f9', 200: '#dfe6f2' },
        tim: { red: '#e4002b' },
      },
      fontFamily: {
        display: ['"Sora Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      maxWidth: { site: '1280px' },
      boxShadow: {
        glow: '0 0 0 1px rgba(74,139,255,.25), 0 20px 60px -20px rgba(31,107,255,.55)',
        card: '0 1px 0 rgba(255,255,255,.06) inset, 0 30px 60px -30px rgba(3,8,23,.6)',
        soft: '0 24px 60px -28px rgba(10,22,56,.28)',
      },
    },
  },
  plugins: [],
}
