/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 15% 30%, rgba(59,130,246,0.1), transparent 45%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(34,211,238,0.45), 0 0 60px rgba(168,85,247,0.25), inset 0 0 30px rgba(255,255,255,0.06)',
        'neon-sm': '0 0 12px rgba(34,211,238,0.35), 0 0 28px rgba(236,72,153,0.2)',
        lamp: '0 0 40px rgba(250,204,21,0.55), 0 0 80px rgba(34,211,238,0.35), 0 0 120px rgba(59,130,246,0.2)',
      },
      animation: {
        'grid-pan': 'grid-pan 22s linear infinite',
        flicker: 'flicker 4s ease-in-out infinite',
      },
      keyframes: {
        'grid-pan': {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '48px 48px, -48px -48px' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '52%': { opacity: '0.92' },
          '54%': { opacity: '1' },
          '56%': { opacity: '0.88' },
          '58%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
