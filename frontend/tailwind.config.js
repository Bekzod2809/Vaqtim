/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Ranglar "Vaqtim — Logo" brend faylidan olingan
      colors: {
        oltin: {
          DEFAULT: '#C7A560',
          och: '#DCC28A',
          toq: '#A8873F',
        },
        krem: '#F6F2E9',
        qora: {
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
        paydo: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        sahifa: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        yaltirash: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        toast: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        tushish: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // "both" — kechikish paytida ham boshlang'ich holatda turadi (ko'rinmaydi)
        paydo: 'paydo 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        sahifa: 'sahifa 0.5s ease-out both',
        yaltirash: 'yaltirash 1.6s ease-in-out infinite',
        toast: 'toast 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        tushish: 'tushish 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
