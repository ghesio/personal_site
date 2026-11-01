/** @type {import('tailwindcss').Config} */
// Build: tailwindcss -c tailwind.config.js -i css/tailwind.input.css -o css/tailwind.css --minify
// (standalone CLI v3.4.17: https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17)
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./js/**/*.js"],
  theme: { extend: {} },
  plugins: [],
};
