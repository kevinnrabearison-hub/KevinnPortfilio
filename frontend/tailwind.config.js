/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        code: ['Fira Code', 'monospace'],
      },
      colors: {
        background: '#1E1E1E',
        text: '#D4D4D4',
      },
    },
  },
  plugins: [],
}
