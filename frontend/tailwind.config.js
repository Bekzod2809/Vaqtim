/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Do'kon qismi uchun: qora fon va tilla rang
        oltin: {
          DEFAULT: '#C9A45C',
          och: '#E3C98F',
          toq: '#A8843F',
        },
        qora: {
          DEFAULT: '#0B0B0C',
          2: '#141416',
          3: '#1E1E21',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
