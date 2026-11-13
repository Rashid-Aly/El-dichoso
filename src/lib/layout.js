import face1 from "@/assets/face-1.png"
import face2 from "@/assets/face-2.png"
import face3 from "@/assets/face-3.png"
import face4 from "@/assets/face-4.png"
import face5 from "@/assets/face-5.png"
import face6 from "@/assets/face-6.png"

// Hotspot / cell boxes, in % of the 1380x2373 stage artwork
export const BANHOT = { l: 6.015037593984963, t: 78.39526122512349, w: 86.46616541353383, h: 9.109372673149371 }
// fingertip (top-left of hand.png) rests on the right side of coin 3
export const HBOX = { l: 78.2, t: 40.7, w: 11.560150375939848, h: 8.089122933756641 }

// Centres of the "1"–"6" labels painted in bg.jpg (948x1659); the badges cover them
export const LABELS = [651, 815].flatMap((y) =>
  [240, 478, 708].map((x) => ({ x: (x / 948) * 100, y: (y / 1659) * 100 }))
)

export const CELLS = [
  { l: 16.79047619047619, t: 39.9974230456039, w: 17.42105263157895, h: 7.353497840682617 },
  { l: 41.41228070175439, t: 39.9974230456039, w: 17.42105263157895, h: 7.353497840682617 },
  { l: 66, t: 39.9974230456039, w: 17.42105263157895, h: 7.353497840682617 },
  { l: 17.00125313283208, t: 49.50085770684614, w: 17.372932330827066, h: 7.453497840682617},
  { l: 41.47368421052631, t: 49.30085770684614, w: 17.372932330827066, h: 8},
  { l: 65.88345864661655, t: 49.70085770684614, w: 17.172932330827066, h: 7.353497840682617 },
]

// GUARDAR / OTROS 6 / WHATSAPP row, in % of the 948x1659 bg.jpg artwork.
// Spans the red "My Store" pill (x 50–898) inside the blue gap (y 1080–1214).
const ACTION = { x: 50, span: 848, gap: 14, y: 1094, h: 100 }
const ACTION_W = (ACTION.span - ACTION.gap * 2) / 3
export const ACTION_BTNS = [0, 1, 2].map((i) => ({
  l: ((ACTION.x + i * (ACTION_W + ACTION.gap)) / 948) * 100,
  t: (ACTION.y / 1659) * 100,
  w: (ACTION_W / 948) * 100,
  h: (ACTION.h / 1659) * 100,
}))

export const FACES = [face1, face2, face3, face4, face5, face6]

export const SW = 1380
export const SH = 2373

// original `pc()` helper: box -> inline % style
export const pc = (o) => ({
  left: `${o.l}%`,
  top: `${o.t}%`,
  width: `${o.w}%`,
  height: `${o.h}%`,
})
