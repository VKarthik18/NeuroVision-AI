const modeBtn = document.getElementById("modeBtn");

function loadTheme(){
  const t = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", t === "light");
  if(modeBtn) modeBtn.textContent = t === "light" ? "☀️" : "🌙";
}

function toggleTheme(){
  const cur = document.body.classList.contains("light") ? "light" : "dark";
  const next = cur === "light" ? "dark" : "light";
  localStorage.setItem("theme", next);
  loadTheme();
}

if(modeBtn) modeBtn.addEventListener("click", toggleTheme);

// ⬇️ VERY IMPORTANT: run on page load
window.addEventListener("DOMContentLoaded", loadTheme);
