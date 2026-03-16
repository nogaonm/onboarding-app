import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4559F6',
          dark: '#1A1A26',
        },
        gray: {
          50: '#FAFAFC',
          100: '#F5F5F7',
          200: '#E8E9EC',
          300: '#8C8D96',
          400: '#5A5B66',
        },
      },
    },
  },
  plugins: [],
}
export default config
