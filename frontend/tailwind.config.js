/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#46178F',
        'brand-pink': '#E6007E',
        'brand-blue': '#00B8E6',
        'brand-yellow': '#FFCF00',
        'brand-green': '#00A859',
        'dark-purple': '#2D0D59',
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
