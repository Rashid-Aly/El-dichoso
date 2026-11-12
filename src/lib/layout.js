import face1 from "@/assets/face-1.png"
import face2 from "@/assets/face-2.png"
import face3 from "@/assets/face-3.png"
import face4 from "@/assets/face-4.png"
import face5 from "@/assets/face-5.png"
import face6 from "@/assets/face-6.png"

// Hotspot / cell boxes, in % of the 1380x2373 stage artwork
export const BANHOT = { l: 6.015037593984963, t: 78.39526122512349, w: 86.46616541353383, h: 9.109372673149371 }
export const HBOX = { l: 80.85839598997494, t: 60.14007838813215, w: 11.560150375939848, h: 8.089122933756641 }

export const CELLS = [
  { l: 13.69047619047619, t: 56.5874230456039, w: 18.42105263157895, h: 8.453497840682617 },
  { l: 39.91228070175439, t: 56.5874230456039, w: 18.42105263157895, h: 8.453497840682617 },
  { l: 66.13408521303258, t: 56.5874230456039, w: 18.42105263157895, h: 8.453497840682617 },
  { l: 13.00125313283208, t: 67.70085770684614, w: 19.172932330827066, h: 9.036497691764177 },
  { l: 39.47368421052631, t: 67.70085770684614, w: 19.172932330827066, h: 9.036497691764177 },
  { l: 65.88345864661655, t: 67.70085770684614, w: 19.172932330827066, h: 9.036497691764177 },
]

export const BTN = [
  { l: 1.5037593984962407, t: 87.99654002262292, w: 30.23182957393484, h: 10.931247207779245 },
  { l: 33.23934837092732, t: 87.99654002262292, w: 32.61278195488722, h: 10.931247207779245 },
  { l: 67.23057644110276, t: 87.99654002262292, w: 30.35714285714286, h: 10.931247207779245 },
]

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
