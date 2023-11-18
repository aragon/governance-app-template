import type { Config } from 'tailwindcss'


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: {
        50: 'rgba(var(--color-primary-50), var(--tw-text-opacity))',
        100:'rgba(var(--color-primary-100), var(--tw-text-opacity))',
        200:'rgba(var(--color-primary-200), var(--tw-text-opacity))',
        300:'rgba(var(--color-primary-300), var(--tw-text-opacity))',
        400:'rgba(var(--color-primary-400), var(--tw-text-opacity))',
        500:'rgba(var(--color-primary-500), var(--tw-text-opacity))',
        600:'rgba(var(--color-primary-600), var(--tw-text-opacity))',
        700:'rgba(var(--color-primary-700), var(--tw-text-opacity))',
        800:'rgba(var(--color-primary-800), var(--tw-text-opacity))',
        900:'rgba(var(--color-primary-900), var(--tw-text-opacity))'
    }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
