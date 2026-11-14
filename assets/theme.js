// Runs in <head> before the page paints, so there is no flash of the wrong theme.
(function () {
  var t = null;
  try { t = JSON.parse(localStorage.getItem("pkarcade:theme")); } catch (e) {}
  if (t !== "day" && t !== "night") t = matchMedia("(prefers-color-scheme: light)").matches ? "day" : "night";
  document.documentElement.dataset.theme = t;
})();
