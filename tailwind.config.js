/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': 'hsl(220, 20%, 98%)',
        'accent': 'hsl(130, 70%, 45%)',
        'primary': 'hsl(210, 90%, 40%)',
        'surface': 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(220, 30%, 20%)',
        'text-secondary': 'hsl(220, 20%, 50%)',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 20%, 10%, 0.08)',
      },
    },
  },
  plugins: [],
}