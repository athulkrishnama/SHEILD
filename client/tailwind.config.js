/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Christmas theme
        "christmas-red": "#C41E3A",
        "christmas-green": "#165B33",
        "christmas-gold": "#FFD700",
        // Superhero theme
        "hero-blue": "#1E3A8A",
        "hero-purple": "#6B21A8",
        "hero-red": "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
