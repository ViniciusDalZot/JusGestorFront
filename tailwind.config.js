/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'hammer': 'hammerAnimation 2s ease-in-out infinite',
      },
      keyframes: {
        hammerAnimation: {
          "0%": {
            transform: "rotate(-50deg)",
          },
          "50%": {
            transform: "rotate(-50deg)",
          },
          "100%": {
            transform: "rotate(-50deg)",
          },
        
          "40%": {
            transform: "rotate(50deg)",
          }
        }
      }
    },
  },
  plugins: [],
}

