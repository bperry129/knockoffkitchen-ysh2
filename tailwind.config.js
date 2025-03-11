/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF4500",
          50: '#fff1ed',
          100: '#ffe0d5',
          200: '#ffc1ab',
          300: '#ff9c76',
          400: '#ff6b3d',
          500: '#FF4500',
          600: '#e63100',
          700: '#c02800',
          800: '#9b2100',
          900: '#7f1e00',
          950: '#450c00',
        },
        secondary: {
          DEFAULT: "#222222",
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#222222',
          950: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
