import bgUrl from "@/assets/bg.jpg"
import overlayUrl from "@/assets/overlay.png"
import { CELLS, SW, SH } from "@/lib/layout"

export const KEY = "dichoso.card.v2"

// unbiased random int in [0, n) using crypto
export function rnd(n) {
  const lim = Math.floor(4294967296 / n) * n
  const a = new Uint32Array(1)
  do {
    crypto.getRandomValues(a)
  } while (a[0] >= lim)
  return a[0] % n
}

export function newCard() {
  const s = new Set()
  while (s.size < 6) s.add(rnd(100))
  const nums = [...s].map((n) => String(n).padStart(2, "0"))
  const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")
  return { id, ts: new Date().toISOString(), nums, rev: [0, 0, 0, 0, 0, 0], demo: true }
}

export function persist(card) {
  try {
    localStorage.setItem(KEY, JSON.stringify(card))
  } catch (e) {}
}

export function restore() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY))
    if (c && c.nums && c.nums.length === 6) return c
  } catch (e) {}
  return null
}

const loadImg = (s) =>
  new Promise((r) => {
    const i = new Image()
    i.onload = () => r(i)
    i.onerror = () => r(null)
    i.src = s
  })

// Draws the shareable PNG (same artwork + numbers + legal footer)
export async function renderCardPng(card) {
  const U = SW / 695,
    CH = 1853,
    FT = 130 * U,
    W = SW,
    H = CH + FT
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const x = c.getContext("2d")
  const f = (w, px) => `italic ${w} ${px}px 'Barlow Condensed',Impact,sans-serif`
  try {
    await document.fonts.load(f(900, 40))
  } catch (e) {}

  x.fillStyle = "#0a2a9c"
  x.fillRect(0, 0, W, H)
  const [bg, ly] = await Promise.all([loadImg(bgUrl), loadImg(overlayUrl)])
  if (bg) x.drawImage(bg, 0, 0, SW, CH, 0, 0, W, CH)

  card.nums.forEach((n, i) => {
    const o = CELLS[i],
      cx = ((o.l + o.w / 2) / 100) * W,
      cy = ((o.t + o.h / 2) / 100) * SH,
      rx = (o.w / 200) * W,
      ry = (o.h / 200) * SH
    x.beginPath()
    x.ellipse(cx, cy, rx, ry, 0, 0, 7)
    const g = x.createRadialGradient(cx, cy - ry * 0.3, 2, cx, cy, rx)
    g.addColorStop(0, "#ffe85c")
    g.addColorStop(1, "#ffbe00")
    x.fillStyle = g
    x.fill()
    x.fillStyle = "#111"
    x.font = f(900, ry * 1.1)
    x.textAlign = "center"
    x.textBaseline = "middle"
    x.fillText(n, cx, cy + ry * 0.06)
  })

  if (ly) x.drawImage(ly, 0, 0, SW, CH, 0, 0, W, CH)

  x.textBaseline = "alphabetic"
  x.textAlign = "center"
  x.fillStyle = "#ffd21f"
  x.font = f(900, 30 * U)
  x.fillText("¡AHÍ ESTÁN TUS NÚMEROS DE LA SUERTE!", W / 2, CH + 30 * U, W - 40)

  x.fillStyle = "#fff"
  x.font = `600 ${13 * U}px Arial,sans-serif`
  let line = "",
    y = CH + 58 * U
  "Esta tarjeta no ofrece premios. Los números son aleatorios y solo para entretenimiento. No aumentan las probabilidades de ganar en ningún juego."
    .split(" ")
    .forEach((w) => {
      const q = line + w + " "
      if (x.measureText(q).width > W - 60 * U) {
        x.fillText(line, W / 2, y)
        y += 17 * U
        line = w + " "
      } else line = q
    })
  x.fillText(line, W / 2, y)

  x.fillStyle = "#ffd21f"
  x.font = `700 ${11 * U}px Arial`
  x.fillText("DEMO GRATIS · ID " + card.id.slice(0, 8).toUpperCase(), W / 2, H - 8 * U)

  return new Promise((r) => c.toBlob(r, "image/png"))
}
