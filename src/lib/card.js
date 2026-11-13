import bgUrl from "@/assets/bg.jpg"
import { CELLS, LABELS, SW, SH } from "@/lib/layout"

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

const ellipse = (x, cx, cy, rx, ry) => {
  x.beginPath()
  x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
}

// Draws the shareable PNG: the card as shown on screen (art + revealed coins + 1–6 labels) + legal footer.
// Coin / label styling mirrors ScratchCell and CardScreen (cqw there = W / 100 here).
export async function renderCardPng(card) {
  const W = SW,
    U = W / 695,
    FT = 130 * U,
    H = SH + FT,
    q = W / 100
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const x = c.getContext("2d")
  const f = (w, px) => `italic ${w} ${px}px 'Barlow Condensed',Impact,sans-serif`
  const fb = (px) => `italic 900 ${px}px 'Barlow','Barlow Condensed',Impact,sans-serif`
  try {
    await Promise.all([document.fonts.load(f(900, 40)), document.fonts.load(fb(40))])
  } catch (e) {}

  x.fillStyle = "#0a2a9c"
  x.fillRect(0, 0, W, H)
  const bg = await loadImg(bgUrl)
  if (bg) x.drawImage(bg, 0, 0, W, SH)

  x.textAlign = "center"
  x.textBaseline = "middle"

  card.nums.forEach((n, i) => {
    const o = CELLS[i],
      l = (o.l / 100) * W,
      t = (o.t / 100) * SH,
      w = (o.w / 100) * W,
      h = (o.h / 100) * SH,
      cx = l + w / 2,
      cy = t + h / 2

    // rim: dark outline + drop shadow, then the bevelled gold ring
    x.save()
    x.shadowColor = "#0007"
    x.shadowOffsetY = 0.5 * q
    x.shadowBlur = 0.8 * q
    ellipse(x, cx, cy, w / 2 + 0.3 * q, h / 2 + 0.3 * q)
    x.fillStyle = "#6b4300"
    x.fill()
    x.restore()
    const a = (160 * Math.PI) / 180,
      dx = (Math.sin(a) * w) / 2,
      dy = (-Math.cos(a) * h) / 2
    const rim = x.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
    rim.addColorStop(0, "#fff3a0")
    rim.addColorStop(0.35, "#f5b800")
    rim.addColorStop(0.7, "#b77400")
    rim.addColorStop(1, "#ffd84a")
    ellipse(x, cx, cy, w / 2, h / 2)
    x.fillStyle = rim
    x.fill()

    // face
    const fx = w / 2 - 1.1 * q,
      fy = h / 2 - 1.1 * q
    x.save()
    x.translate(cx, cy)
    x.scale(1, fy / fx)
    const face = x.createRadialGradient(-0.1 * fx, -0.4 * fx, 0, -0.1 * fx, -0.4 * fx, fx * 1.25)
    face.addColorStop(0, "#fff8b0")
    face.addColorStop(0.35, "#ffe23a")
    face.addColorStop(0.7, "#ffc400")
    face.addColorStop(1, "#f0a000")
    ellipse(x, 0, 0, fx, fx)
    x.fillStyle = face
    x.fill()
    x.restore()

    // number
    x.fillStyle = "#111"
    x.font = fb(12 * q)
    if ("letterSpacing" in x) x.letterSpacing = `${-0.03 * 12 * q}px`
    x.fillText(n, cx, cy + 0.6 * q)
    if ("letterSpacing" in x) x.letterSpacing = "0px"
  })

  // red "1"–"6" labels with white outline
  LABELS.forEach(({ x: lx, y: ly }, i) => {
    const px = (lx / 100) * W,
      py = (ly / 100) * SH
    x.font = fb(7 * q)
    x.lineJoin = "round"
    x.save()
    x.shadowColor = "#0006"
    x.shadowOffsetY = 0.35 * q
    x.shadowBlur = 0.3 * q
    x.strokeStyle = "#fff"
    x.lineWidth = 2 * q
    x.strokeText(String(i + 1), px, py)
    x.restore()
    x.fillStyle = "#e8141c"
    x.fillText(String(i + 1), px, py)
  })

  const CH = SH

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
