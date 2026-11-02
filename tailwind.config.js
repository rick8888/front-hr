/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium blue-violet brand palette
        primary: {
          50: "#f1f4ff",
          100: "#e1e8ff",
          200: "#c8d4ff",
          300: "#a5b8ff",
          400: "#7c94fa",
          500: "#526fe9",
          600: "#3d59d4",
          700: "#3047b2",
          800: "#293d8f",
          900: "#243671",
        },
        // Secondary colors
        secondary: {
          50: "#f5f2ff",
          100: "#eee8ff",
          200: "#ddd2ff",
          300: "#c3aeff",
          400: "#a186fb",
          500: "#805eea",
          600: "#6945d3",
          700: "#5637b2",
          800: "#462f8e",
          900: "#39296f",
        },
        // Neutral colors
        neutral: {
          50: "#f6f8fc",
          100: "#eef1f7",
          200: "#e1e6f0",
          300: "#cbd3e2",
          400: "#99a5bc",
          500: "#74819a",
          600: "#586680",
          700: "#3d4a65",
          800: "#27344f",
          900: "#17213c",
        },
        // Success
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        // Warning
        warning: {
          50: "#fffbeb",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
        },
        // Error
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        // Info
        info: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
      },
      borderRadius: {
        xs: "0.125rem",
        sm: "0.1875rem",
        md: "0.25rem",
        lg: "0.3125rem",
        xl: "0.375rem",
        "2xl": "0.375rem",
        "3xl": "0.375rem",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(24, 39, 75, 0.04)",
        sm: "0 2px 8px rgba(24, 39, 75, 0.06)",
        md: "0 8px 22px rgba(24, 39, 75, 0.08)",
        lg: "0 14px 34px rgba(24, 39, 75, 0.1)",
        xl: "0 22px 48px rgba(24, 39, 75, 0.14)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
