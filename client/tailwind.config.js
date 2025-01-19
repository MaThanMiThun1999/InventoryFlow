/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#9857D3',
        'primary-dark': '#AF19FF',
        secondary: '#64748b',
        'btn-primary': '#0D51C6',
        'text-primary': '#0161AD',
        cyber: '#f3d965',
        'cyber-purple': '#9857D3',
        'dark-background': '#0A0F18',
        'plain-black-background': '#000000',
        'dark-primary': '#AF19FF',
        text: '#e2e8f0',
        'text-subdued': '#94a3b8',
        'dark-text': '#ffffff',
        'dark-text-subdued': '#CBD5E1',
        background: '#f1f5f9',
        'gray-custom': '#d1d5db',
      },
      fontFamily: {
        'share-tech-mono': ['"Share Tech Mono"', 'monospace'],
        roboto: ['"Roboto"', 'sans-serif'],
      },
      animation: {
        'border-width': 'border-width 5s ease-in-out infinite',
      },
      keyframes: {
        'border-width': {
          '0%, 100%': { 'border-width': '0px' },
          '50%': { 'border-width': '1px' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 15px #9857D3, 0 0 30px #9857D3',
        'glow-secondary': '0 0 15px #f3d965, 0 0 30px #f3d965',
      },
    },
  },
  plugins: [],
};
