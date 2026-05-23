/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF5', // Avorio/Crema
        textPrimary: '#2C2A29', // Grigio scuro/Terra
        accent: '#8A9A5B', // Verde Salvia/Ulivo
        cta: '#B33939', // Rosso Faro
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
