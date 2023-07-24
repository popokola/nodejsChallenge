/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.vue', 
    './src/components/**/*.vue',
    './src/views/**/*.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}

