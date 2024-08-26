/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ['Josefin Sans', 'sans-serif'],
        satisfy: ['Satisfy', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

