/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3e54a0',
        secondary: '#08112F',
        textPrimary: '#14181B',
        textSecondary: '#57636C',
        dark: {
          background: '#1a202c',
          surface: '#2d3748',
          text: '#e2e8f0',
          primary: '#4a5568',
        },
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'secondary': ['Montserrat', 'sans-serif'],
        'header': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.5625rem',    // 9px
        'sm': '0.65625rem',   // 10.5px
        'base': '0.75rem',    // 12px
        'lg': '0.84375rem',   // 13.5px
        'xl': '0.9375rem',    // 15px
        '2xl': '1.125rem',    // 18px
        '3xl': '1.40625rem',  // 22.5px
        '4xl': '1.6875rem',   // 27px
        '5xl': '2.25rem',     // 36px
        '6xl': '2.8125rem',   // 45px
      },
    },
  },
  plugins: [],
};