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
        vscode: {
          foreground: '#D4D4D4',
          titlebar: '#1F1F1F',
          activitybar: '#252526',
          sidebar: '#252526',
          editor: '#1E1E1E',
          tabbar: '#252526',
          tabActive: '#1E1E1E',
          tabInactive: '#2D2D2D',
          border: '#3C3C3C',
          hover: '#2A2D2E',
          statusbar: '#007ACC',
          statusbarHover: '#005A9E',
        },
      },
    },
  },
  plugins: [],
}
