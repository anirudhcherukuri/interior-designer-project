/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
          950: "#0C0A09"
        },
        accent: {
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D4AF37",
          600: "#B4941F",
          700: "#856D14",
          800: "#6B5610",
          900: "#42360A"
        },
        cream: {
          50: "#FFFFFF",
          100: "#FAFAF9",
          200: "#F5F5F4"
        },
        luxury: {
          gold: "#D4AF37",
          black: "#1C1917",
          white: "#FFFFFF",
          cream: "#FAFAF9"
        }
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        accent: ["Montserrat", "sans-serif"]
      },
      backgroundImage: {
        "luxury-gradient": "linear-gradient(135deg, #FFFFFF 0%, #FAFAF9 100%)",
        "cream-gradient": "linear-gradient(to bottom right, #FFFFFF, #FAFAF9)",
        "sand-gradient": "linear-gradient(135deg, #FFFFFF 0%, #F5F5F4 100%)",
        "hero-overlay": "linear-gradient(to bottom, rgba(28, 25, 23, 0.4), rgba(28, 25, 23, 0.6))",
        "service-card": "linear-gradient(to bottom right, #ffffff, #FAFAF9)"
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(28, 25, 23, 0.12)",
        "luxury-lg": "0 25px 60px -15px rgba(28, 25, 23, 0.2)",
        soft: "0 4px 20px rgba(0, 0, 0, 0.03)",
        premium: "0 10px 30px rgba(0, 0, 0, 0.05)",
        service: "0 15px 30px -5px rgba(212, 175, 55, 0.12)"
      }
    }
  },
  plugins: []
};
