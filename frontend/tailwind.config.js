/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Make sure this matches your structure
    ],
    theme: {
      extend: {
          // Optional: Extend theme if needed
          backgroundImage: {
              'auth-bg': "url('/background.jpg')", // If image is in public folder
              // 'auth-bg': "url('/src/assets/background.jpg')", // If image is in assets (adjust path)
          }
      },
    },
    plugins: [],
  }