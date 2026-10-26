/** @type {import('tailwindcss').Config} */
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: c("bg"), surface: c("surface"), raised: c("raised"),
        ink: c("ink"), muted: c("muted"),
        brand: c("brand"), "brand-soft": c("brand-soft"),
        violet: c("violet"), "violet-soft": c("violet-soft"),
      },
      borderColor: { line: "var(--line)" },
      fontFamily: {
        sans: ['"Geist Variable"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono Variable"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
