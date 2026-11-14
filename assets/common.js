// Small helpers shared by every game.

function toast(msg, ms = 1800) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

// localStorage can throw (private mode, some embedded browsers) - never let that break a game.
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("pkarcade:" + key);
      return v === null ? fallback : JSON.parse(v);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("pkarcade:" + key, JSON.stringify(value)); } catch {}
  },
};

// Share text with the phone's share sheet, or copy it to the clipboard.
async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch { /* user cancelled */ }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied - paste it in WhatsApp!");
  } catch {
    prompt("Copy this:", text);
  }
}

function waLink(text) {
  return "https://wa.me/?text=" + encodeURIComponent(text);
}

// Day number in Gambian time (GMT), used for daily puzzles.
function dayNumber(epoch = Date.UTC(2026, 0, 1)) {
  return Math.floor((Date.now() - epoch) / 86400000);
}

// Deterministic shuffle so every player gets the same daily puzzle.
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
