export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0F111A',
          800: '#171A23',
          700: '#232733',
        },
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5a52d4'
        },
        accent: '#FF6584'
      }
    },
  },
  plugins: [],
}
