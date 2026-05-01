/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Page background: a barely-there cool blue so pure-white cards,
        // the header, and the footer all gain quiet visual contrast.
        canvas: "#f4f7fb",
        primary: {
          50: "#e9f5f2",
          100: "#d4dcd9",
          200: "#bbc3be",
          300: "#a1aba5",
          400: "#87938b",
          500: "#6d7972",
          600: "#555f58",
          700: "#323c34",
          800: "#232924",
          900: "#272727",
        },
        accent: {
          50: "#e6f3fe",
          100: "#80c2f9",
          200: "#7bcfff",
          300: "#49bbff",
          400: "#1aa8ff",
          500: "#008ee6",
          600: "#006fb4",
          700: "#004f82",
          800: "#002f51",
          900: "#001121",
        },
      },
      fontFamily: {
        heading: ["Kelson", "system-ui", "Helvetica", "sans-serif"],
        body: ["system-ui", "Helvetica", "sans-serif"],
      },
      maxWidth: {
        site: "1550px",
        content: "1150px",
      },
      keyframes: {
        "emoji-in": {
          "0%":   { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)",     opacity: "1" },
        },
        "emoji-out": {
          "0%":   { transform: "translateY(0)",      opacity: "1" },
          "100%": { transform: "translateY(-100%)",  opacity: "0" },
        },
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        "slide-out-left": {
          "0%":   { transform: "translateX(0)",     opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
      },
      animation: {
        "emoji-in":  "emoji-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "emoji-out": "emoji-out 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right":  "slide-in-right 450ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-out-left":  "slide-out-left 450ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
