const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        'gray-black': '#1a1a1a',
        'red-1': '#c3073f',
        'red-2': '#950740',
      },
    },
  },
  variants: {},
  plugins: [],
}
