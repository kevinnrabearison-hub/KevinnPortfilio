/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        code: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        background: '#1E1E1E',
        text: '#D4D4D4',
        vscode: {
          foreground: '#CCCCCC',
          titlebar: '#1E1E1E',
          activitybar: '#181818',
          sidebar: '#252526',
          editor: '#1E1E1E',
          tabbar: '#2D2D2D',
          tabActive: '#1E1E1E',
          tabInactive: '#2D2D2D',
          border: '#333333',
          hover: '#2A2D2E',
          statusbar: '#007ACC',
          statusbarHover: '#1F8AD2',
          terminal: '#181818',
          lineHighlight: '#282828',
          accent: '#007ACC',
          accentGlow: 'rgba(0, 122, 204, 0.4)',
        },
      },
      boxShadow: {
        'vscode-glow': '0 0 20px rgba(0, 122, 204, 0.3)',
        'neon-blue': '0 0 25px rgba(59, 130, 246, 0.5)',
        'neon-green': '0 0 25px rgba(34, 197, 94, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
