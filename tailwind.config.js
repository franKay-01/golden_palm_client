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
        // Sale hero entrance. The individual `translate`/`scale` properties are used (not `transform`)
        // so they combine with the rotation classes on the photos instead of replacing them.
        'hero-fade': { from: { opacity: '0' }, to: { opacity: '1' } },
        'hero-up': { from: { opacity: '0', translate: '0 1.75rem' }, to: { opacity: '1', translate: '0 0' } },
        'hero-left': { from: { opacity: '0', translate: '-4rem 0' }, to: { opacity: '1', translate: '0 0' } },
        'hero-right': { from: { opacity: '0', translate: '4rem 0' }, to: { opacity: '1', translate: '0 0' } },
        'hero-pop': { from: { opacity: '0', scale: '0.5' }, to: { opacity: '1', scale: '1' } },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1s infinite',
        'hero-fade': 'hero-fade 0.6s ease-out backwards',
        'hero-up': 'hero-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'hero-left': 'hero-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'hero-right': 'hero-right 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'hero-pop': 'hero-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards',
      },
    },
  },
  plugins: [],
}

