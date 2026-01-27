/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  future: {
    // Enable future optimizations
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        primary: '#0F3D3E',
        accent: '#DC2626',
        ink: '#0E121B',
        muted: '#F4F6F8',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.6)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.7)',
        'xl': '0 6px 12px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-delayed': 'fadeIn 0.8s ease-out 0.3s both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const textShadowUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-xl': {
          textShadow: '0 6px 12px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      }
      addUtilities(textShadowUtilities)
    }
  ],
  corePlugins: {
    // Disable unused core plugins for smaller bundle
    container: false,
  },
}