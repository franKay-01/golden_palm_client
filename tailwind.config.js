/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'caslon': ['Big Caslon', 'serif'],
        'canaro': ['Canaro', 'sans-serif'],
        'canaro-light': ['Canaro Light', 'sans-serif'],
        'canaro-book': ['Canaro Book', 'sans-serif'],
        'canaro-semibold': ['Canaro SemiBold', 'sans-serif'],
        'painting': ['Painting With Chocolate', 'cursive'],
        'dry-brush': ['Dry Brush', 'cursive'],
      },
      colors: {
        'gp-yellow': '#FBB041',
        'gp-light-green': '#435817',
        'gp-cream': '#FFF9EC',
        'gp-black': '#262222',
        'gp-dark-green': '#414A14',
        'gp-bright-green': '#3A8C52',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1s infinite',
      },
    },
  },
  plugins: [],
}

