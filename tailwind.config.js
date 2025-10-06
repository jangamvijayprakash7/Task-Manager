/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f1ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#7E57C2',
          800: '#6b21a8',
          900: '#581c87',
        },
        secondary: '#FFFFFF',
        border: '#E5E7EB',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'DEFAULT': '8px',      // Standard rounded corners for cards and containers
        'md': '10px',          // Medium rounded corners
        'lg': '12px',          // Large rounded corners for main cards
        'xl': '16px',          // Extra large rounded corners
        '2xl': '20px',         // Very large rounded corners
        '3xl': '24px',         // Maximum rounded corners
        'full': '9999px',      // Pill-shaped elements
        'button': '8px',       // Consistent button radius
        'input': '8px',        // Consistent input radius
        'card': '12px',        // Consistent card radius
        'avatar': '50%',       // Perfect circles for avatars
      },
      spacing: {
        '18': '4.5rem',        // 72px
        '88': '22rem',         // 352px
        '128': '32rem',        // 512px
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
