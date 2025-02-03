/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust the paths according to your project structure
    './components/**/*.{js,ts,jsx,tsx}', // Include components directory
    './pages/**/*.{js,ts,jsx,tsx}', // Include pages directory
    './public/**/*.{html}', // Include public directory for HTML files
    './index.html', // Include index.html
  ],
  theme: {
    extend: {
      // Define custom utilities here if needed
      borderColor: {
        'border': '#e5e7eb', // Example custom border color
      },
    },
  },
  plugins: [],
};
