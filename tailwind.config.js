/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      _colors: {
        brick: "var(--primary-color-brick)",
        sea: "#ffffff",
        grass: "#be995b",
        wood: "#be995b",
        darkblue: "var(--secondary-color-blue)",
        pink: "var(--secondary-color-pink)",
        salmon: "#ffffff",
        cyan: "var(--secondary-color-cyan)",
      },
      colors: {
        coreanblue: "#449ca8",
        brick: "var(--primary-color-brick)",
        sea: "var(--primary-color-sea)",
        grass: "var(--primary-color-grass)",
        wood: "#ffffff",
        darkblue: "#6f0b49",
        pink: "var(--secondary-color-pink)",
        salmon: "var(--secondary-color-salmon)",
        cyan: "var(--secondary-color-cyan)",
      },
      fontFamily: {
        "pier-sans-bold": ["PierSansBold", "sans-serif"],
        "pier-sans-medium": ["PierSansMedium", "sans-serif"],
        "pier-sans-regular": ["PierSansRegular", "sans-serif"],
        "albra-serif-bold": ["AlbraSerifBold", "sans-serif"],
        "albra-serif-medium": ["AlbraSerifMedium", "sans-serif"],
        "albra-serif-regular": ["AlbraSerifRegular", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
