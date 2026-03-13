/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1a2744',
          950: '#102a43',
        },
        gold: {
          DEFAULT: '#d69e2e',
          light: '#f6e05e',
          50: '#fffff0',
          100: '#fefcbf',
          200: '#fefcbf',
          300: '#faf089',
          400: '#f6e05e',
          500: '#ecc94b',
          600: '#d69e2e',
          700: '#b7791f',
          800: '#975a16',
          900: '#744210',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: '#243b53',
            h1: { fontFamily: 'Georgia, serif', color: '#1a2744' },
            h2: { fontFamily: 'Georgia, serif', color: '#1a2744' },
            h3: { fontFamily: 'Georgia, serif', color: '#1a2744' },
            a: { color: '#4299e1', textDecoration: 'underline' },
            blockquote: { borderLeftColor: '#d69e2e' },
          },
        },
      },
    },
  },
  plugins: [],
};
