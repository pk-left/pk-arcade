// Shared by every page: storage, top bar, theme + sound switches, sound effects, confetti, sharing.

// localStorage can throw (private mode, embedded browsers) - never let that break a game.
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

// ---------------------------------------------------------------------------
// Pixel icons: tiny grids drawn as SVG. "." is empty; other characters pick a colour.
// ---------------------------------------------------------------------------
const PIXEL_COLOURS = { r: "var(--red)", b: "var(--blue)", g: "var(--green)", y: "var(--yellow)", i: "var(--ink)", m: "var(--muted)", s: "var(--shadow)" };
function pixelIcon(rows, size = 22) {
  const h = rows.length, w = rows[0].length;
  let rects = "";
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== ".") rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${PIXEL_COLOURS[c]}"/>`;
  }));
  return `<svg viewBox="0 0 ${w} ${h}" width="${size}" height="${size * h / w}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
const ICONS = {
  back:  ["....i...", "...ii...", "..iiiiii", ".iiiiiii", "..iiiiii", "...ii...", "....i...", "........"],
  sun:   ["...y....", "y..y..y.", "..yyy...", "yyyyyyy.", "..yyy...", "y..y..y.", "...y....", "........"],
  moon:  ["..iii...", ".iii....", "iii.....", "iii.....", "iii....i", ".iii..ii", "..iiiii.", "........"],
  sound: ["...i..i.", "..ii...i", "iiii.i.i", "iiii.i.i", "iiii.i.i", "..ii...i", "...i..i.", "........"],
  mute:  ["...i....", "..ii....", "iiii.r.r", "iiii..r.", "iiii.r.r", "..ii....", "...i....", "........"],
};

// ---------------------------------------------------------------------------
// Theme (night / day)
// ---------------------------------------------------------------------------
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  store.set("theme", t);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = t === "day" ? "#f4e2a6" : "#130b33";
  dispatchEvent(new CustomEvent("themechange", { detail: t }));
}
const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// ---------------------------------------------------------------------------
// Sound effects: short square-wave blips, like an old console. One shared AudioContext.
// ---------------------------------------------------------------------------
const sfx = (() => {
  let ctx = null;
  let muted = store.get("muted", false);
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  // notes: [frequency Hz, start s, length s]
  function play(notes, type = "square", vol = 0.07) {
    if (muted) return;
    let a;
    try { a = ac(); } catch { return; }
    const t0 = a.currentTime + 0.01;
    for (const [f, at, len] of notes) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t0 + at);
      g.gain.setValueAtTime(vol, t0 + at);
      g.gain.setValueAtTime(vol, t0 + at + len * 0.7);
      g.gain.linearRampToValueAtTime(0.0001, t0 + at + len);
      o.connect(g).connect(a.destination);
      o.start(t0 + at); o.stop(t0 + at + len + 0.02);
    }
  }
  return {
    get muted() { return muted; },
    setMuted(m) { muted = m; store.set("muted", m); dispatchEvent(new CustomEvent("mutechange", { detail: m })); },
    context: ac,
    play,
    click: () => play([[660, 0, .04]]),
    key:   () => play([[440, 0, .025]], "square", .04),
    move:  () => play([[330, 0, .03]], "square", .04),
    ok:    () => play([[660, 0, .07], [880, .07, .1]]),
    bad:   () => play([[196, 0, .09], [147, .09, .16]], "sawtooth", .06),
    flip:  () => play([[520, 0, .04]], "triangle", .09),
    coin:  () => play([[988, 0, .06], [1319, .06, .22]]),
    win:   () => play([[523, 0, .09], [659, .09, .09], [784, .18, .09], [1047, .27, .28]]),
    lose:  () => play([[392, 0, .14], [330, .14, .14], [262, .28, .14], [196, .42, .34]], "triangle", .1),
    snap:  () => play([[120, 0, .05], [70, .04, .12]], "sawtooth", .09),
  };
})();

// ---------------------------------------------------------------------------
// Top bar: back button, title, theme switch, sound switch. Built from <body data-title="...">.
// ---------------------------------------------------------------------------
function buildShell() {
  const body = document.body;
  if (!body.dataset.title || document.querySelector(".topbar")) return;
  const home = body.dataset.home !== undefined;
  const flag = document.createElement("div");
  flag.className = "flag";
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML =
    (home ? "" : `<a class="iconbtn" href="../" aria-label="Back to the arcade">${pixelIcon(ICONS.back)}</a>`) +
    `<h1>${body.dataset.title}</h1>
     <button class="iconbtn" id="themeBtn" aria-label="Switch between day and night"></button>
     <button class="iconbtn" id="muteBtn" aria-label="Sound on or off"></button>`;
  body.prepend(bar);
  body.prepend(flag);
  const themeBtn = bar.querySelector("#themeBtn"), muteBtn = bar.querySelector("#muteBtn");
  const paint = () => {
    themeBtn.innerHTML = pixelIcon(document.documentElement.dataset.theme === "day" ? ICONS.moon : ICONS.sun);
    muteBtn.innerHTML = pixelIcon(sfx.muted ? ICONS.mute : ICONS.sound);
  };
  themeBtn.onclick = () => { setTheme(document.documentElement.dataset.theme === "day" ? "night" : "day"); paint(); sfx.click(); };
  muteBtn.onclick = () => { sfx.setMuted(!sfx.muted); paint(); sfx.click(); };
  paint();
}

// Every button and link clicks like a cabinet button.
document.addEventListener("click", e => {
  if (e.target.closest(".btn, .tile, .iconbtn[href]")) sfx.click();
}, true);

// ---------------------------------------------------------------------------
// Pixel confetti for wins
// ---------------------------------------------------------------------------
function confetti(ms = 1800) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.className = "fx";
  document.body.appendChild(c);
  const x = c.getContext("2d");
  const W = c.width = innerWidth, H = c.height = innerHeight;
  const cols = ["--red", "--blue", "--green", "--yellow", "--ink"].map(cssVar);
  const bits = Array.from({ length: 90 }, () => ({
    x: Math.random() * W, y: -20 - Math.random() * H * 0.4, vx: (Math.random() - .5) * 3,
    vy: 2 + Math.random() * 4, s: 6 + Math.floor(Math.random() * 3) * 4, c: cols[Math.floor(Math.random() * cols.length)],
  }));
  const start = performance.now();
  (function frame(t) {
    x.clearRect(0, 0, W, H);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.vy += 0.05;
      x.fillStyle = b.c;
      x.fillRect(Math.round(b.x / 4) * 4, Math.round(b.y / 4) * 4, b.s, b.s);   // snap to the pixel grid
    }
    if (t - start < ms) requestAnimationFrame(frame); else c.remove();
  })(start);
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function toast(msg, ms = 1800) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

// Share text with the phone's share sheet, or copy it to the clipboard.
async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast("Copied. Paste it in WhatsApp!"); }
  catch { prompt("Copy this:", text); }
}

// Day number in Gambian time (GMT), used for daily puzzles.
function dayNumber(epoch = Date.UTC(2026, 0, 1)) {
  return Math.floor((Date.now() - epoch) / 86400000);
}

// Deterministic random numbers, so every player gets the same daily puzzle.
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

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

buildShell();

// Offline support: the service worker keeps a copy of the site on the device.
const SW_URL = new URL("../sw.js", document.currentScript.src);   // works from any page depth
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register(SW_URL).catch(() => {}));
}
