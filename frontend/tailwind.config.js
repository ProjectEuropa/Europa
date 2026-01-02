/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        accent: 'rgb(var(--color-accent))',
        background: 'rgb(var(--color-bg))',
        surface: 'rgb(var(--color-surface))',
        'muted-foreground': 'rgb(156,163,175)',
        // Cybernetic Void テーマカラー
        cyber: {
          primary: '#00c8ff',
          text: '#b0c4d8',
          dark: '#0a0818',
          card: '#0d1124',
          border: '#07324a',
        },
      },
    }
  },
};
