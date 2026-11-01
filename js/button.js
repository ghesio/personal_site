// Get the button
const mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.classList.remove("hidden");
  } else {
    mybutton.classList.add("hidden");
  }
};
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

window.addEventListener("scroll", scrollFunction);

console.log(`
  _   _   _   _  
 / \\ / \\ / \\ / \\ 
( J | A | V | A )
 \\_/ \\_/ \\_/ \\_/ 
`);

console.log(`Please no more CSS. Thx Giannelli 🍌`);

// TL;DR / full story toggle (TL;DR is the default)
const modeToggle = document.getElementById("mode-toggle");

const setMode = (full) => {
  document.body.classList.toggle("tldr", !full);
  modeToggle.setAttribute("aria-checked", String(full));
  try {
    localStorage.setItem("ghes-full-story", full ? "1" : "0");
  } catch (e) {}
};

try {
  if (localStorage.getItem("ghes-full-story") === "1") setMode(true);
} catch (e) {}

modeToggle.addEventListener("click", () => {
  setMode(document.body.classList.contains("tldr"));
});

// dark mode toggle (default: follows the system setting)
const themeToggle = document.getElementById("theme-toggle");
const syncTheme = () =>
  themeToggle.setAttribute("aria-checked", String(document.documentElement.classList.contains("dark")));
syncTheme();

themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("ghes-theme", dark ? "dark" : "light");
  } catch (e) {}
  syncTheme();
});
