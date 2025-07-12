/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a202c', // A dark, clean primary color
        'secondary': '#2d3748', // A slightly lighter dark shade
        'accent': '#3b82f6', // A vibrant blue for actions
        'light-gray': '#edf2f7',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For styling the rich text content
  ],
}