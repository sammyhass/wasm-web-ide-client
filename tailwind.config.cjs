/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
  daisyui: {
    themes: ['dark'],
  },
  plugins: [require('daisyui')],
};
