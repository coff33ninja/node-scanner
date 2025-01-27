/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)', // Define the border color using the CSS variable
        background: 'var(--background)', // Define the background color using the CSS variable
        foreground: 'var(--foreground)', // Define the text color using the CSS variable
      },
    },
  },
  plugins: [],
};
