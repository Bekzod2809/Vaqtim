/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Ranglar "Vaqtim — Logo" brend faylidan olingan
      colors: {
        gold: {
          DEFAULT: '#C7A560',
          light: '#DCC28A',
          deep: '#A8873F',
        },
        cream: '#F6F2E9',
        dark: {
          DEFAULT: '#141311',
          2: '#1C1B19',
          3: '#2B2926',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        appear: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        page: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        toast: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        drop: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // "both" — kechikish paytida ham boshlang'ich holatda turadi (ko'rinmaydi)
        appear: 'appear 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        page: 'page 0.5s ease-out both',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        toast: 'toast 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        drop: 'drop 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
