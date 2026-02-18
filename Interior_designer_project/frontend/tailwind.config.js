/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617"
        },
        gray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917"
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
        royal: {
          50: "#F0F7FF", // Alice Blue
          100: "#E0F2FE", // Pale Sky
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
          950: "#082F49"
        },
        cream: {
          50: "#FFFFFF",
          100: "#F8FAFC", // Cooler white
          200: "#F1F5F9"
        },
        luxury: {
          gold: "#D4AF37",
          black: "#0F172A",
          white: "#F8FAFC", // Cooler white
          charcoal: "#1E293B",
          blue: "#0F172A" // Deep Royal Blue
        }
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        accent: ["Montserrat", "sans-serif"]
      },
      fontSize: {
        "fluid-hero": "clamp(3rem, 8vw + 1rem, 8rem)"
      },
      backgroundImage: {
        "luxury-gradient": "linear-gradient(135deg, #F0F7FF 0%, #FFFFFF 100%)", // Elegant Blue Gradient
        "cream-gradient": "linear-gradient(to bottom right, #FFFFFF, #F0F9FF)", // White to subtle blue
        "sand-gradient": "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
        "hero-overlay": "linear-gradient(to bottom, rgba(8, 47, 73, 0.5), rgba(8, 47, 73, 0.7))", // Bluer overlay
        "service-card": "linear-gradient(to bottom right, #ffffff, #F8FAFC)"
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(0)" } },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" }
        },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.9)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "subtle-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" }
        }
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.7s ease-out",
        "slide-in": "slideIn 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "scale-in": "scaleIn 0.5s ease-out",
        "subtle-zoom": "subtle-zoom 20s infinite alternate ease-in-out"
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(15, 23, 42, 0.15)",
        "luxury-lg": "0 25px 60px -15px rgba(15, 23, 42, 0.25)",
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        premium: "0 10px 30px rgba(0, 0, 0, 0.08)",
        service: "0 15px 30px -5px rgba(212, 175, 55, 0.15)",
        "premium-lg": "0 20px 50px rgba(0,0,0,0.05)",
        "premium-xl": "0 30px 60px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: []
};
