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
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"JetBrains Mono"', '"Fira Code"', '"DM Mono"', 'Consolas', 'monospace'],
        display: ['"JetBrains Mono"', '"Fira Code"', '"DM Mono"', 'Consolas', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"DM Mono"', 'Consolas', 'monospace'],
        code: ['"JetBrains Mono"', '"Fira Code"', '"DM Mono"', 'monospace'],
      },
      colors: {
        background: '#1E1E1E',
        text: '#D4D4D4',
        kim: {
          sky: '#5ab3d5',
          navy: '#1f3864',
          blue: '#2f5288',
          light: '#e6e6e6',
          muted: '#aaaaaa',
        },
        vsc: {
          accent: '#007acc',
          border: '#3e3e42',
          tab: '#2d2d30',
          sidebar: '#252526',
          editor: '#1e1e1e',
          panel: '#333333',
          bgDark: '#252525',
          brightBlue: '#0098ff',
          deepBlue: '#0065a9',
        },
        scy: {
          muted: '#657786',
          border: '#e1e8ed',
          soft: '#f0f4f6',
          light: '#f5f8fa',
          tint: '#f1f8f1',
        },
        vscode: {
          foreground: '#e6e6e6',
          titlebar: '#1e1e1e',
          activitybar: '#181818',
          sidebar: '#252526',
          editor: '#1e1e1e',
          tabbar: '#2d2d30',
          tabActive: '#1e1e1e',
          tabInactive: '#2d2d30',
          border: '#3e3e42',
          hover: '#2f5288/40',
          statusbar: '#007acc',
          statusbarHover: '#1f8ad2',
          terminal: '#181818',
          lineHighlight: '#282828',
          accent: '#5ab3d5',
          accentGlow: 'rgba(90, 179, 213, 0.4)',
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
