// Synthesized sound effects (Web Audio API, no audio files).

let ctx = null
let noiseBuf = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  // browsers keep the context suspended until a user gesture
  if (ctx.state === "suspended") ctx.resume()
  return ctx
}

export const unlockAudio = () => void audio()

// ---- scratch: looping filtered noise whose volume follows finger speed ----
let scratch = null

export function scratchStart() {
  const ac = audio()
  if (!ac || scratch) return
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  src.loop = true
  const hp = ac.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 1800
  const bp = ac.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 3800
  bp.Q.value = 0.9
  const gain = ac.createGain()
  gain.gain.value = 0
  src.connect(hp).connect(bp).connect(gain).connect(ac.destination)
  src.start()
  scratch = { src, bp, gain }
}

// speed: distance moved since last event, as a fraction of the coin width
export function scratchMove(speed) {
  if (!scratch) return
  const t = ctx.currentTime
  const v = Math.min(0.55, speed * 4)
  const g = scratch.gain.gain
  g.cancelScheduledValues(t)
  g.setTargetAtTime(v * (0.75 + Math.random() * 0.5), t, 0.008)
  g.setTargetAtTime(0, t + 0.05, 0.03)
  scratch.bp.frequency.setTargetAtTime(3000 + Math.random() * 2200, t, 0.01)
}

export function scratchStop() {
  if (!scratch) return
  const { src, gain } = scratch
  scratch = null
  const t = ctx.currentTime
  gain.gain.cancelScheduledValues(t)
  gain.gain.setTargetAtTime(0, t, 0.02)
  src.stop(t + 0.15)
}

// ---- celebration: party-popper bursts + rising fanfare + sparkles ----
function tone(ac, out, freq, start, dur, type = "triangle", vol = 0.2) {
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(vol, start + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  o.connect(g).connect(out)
  o.start(start)
  o.stop(start + dur + 0.05)
}

function pop(ac, out, start, vol = 0.5) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  const f = ac.createBiquadFilter()
  f.type = "bandpass"
  f.frequency.setValueAtTime(1200, start)
  f.frequency.exponentialRampToValueAtTime(5000, start + 0.12)
  const g = ac.createGain()
  g.gain.setValueAtTime(vol, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.18)
  src.connect(f).connect(g).connect(out)
  src.start(start, Math.random())
  src.stop(start + 0.2)
}

// low boom under each big hit
function thump(ac, out, start, vol = 0.9) {
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = "sine"
  o.frequency.setValueAtTime(190, start)
  o.frequency.exponentialRampToValueAtTime(46, start + 0.32)
  g.gain.setValueAtTime(vol, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + 0.4)
  o.connect(g).connect(out)
  o.start(start)
  o.stop(start + 0.45)
}

// rising noise sweep that leads into the finale
function whoosh(ac, out, start, dur, vol = 0.25) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  const f = ac.createBiquadFilter()
  f.type = "bandpass"
  f.Q.value = 1.4
  f.frequency.setValueAtTime(400, start)
  f.frequency.exponentialRampToValueAtTime(6000, start + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(vol, start + dur * 0.9)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur + 0.05)
  src.connect(f).connect(g).connect(out)
  src.start(start, Math.random())
  src.stop(start + dur + 0.1)
}

// bright brassy chord: detuned saw + square layered on triangles
function chord(ac, out, freqs, start, dur, vol = 1) {
  freqs.forEach((f) => {
    tone(ac, out, f, start, dur, "triangle", 0.13 * vol)
    tone(ac, out, f * 1.004, start, dur, "sawtooth", 0.035 * vol)
    tone(ac, out, f * 0.996, start, dur * 0.6, "square", 0.025 * vol)
  })
}

const sparkles = (ac, out, start, n, gap) => {
  for (let i = 0; i < n; i++) {
    tone(ac, out, 2200 + Math.random() * 3000, start + i * gap + Math.random() * 0.03, 0.16, "sine", 0.07)
  }
}

// ~3.8s: popper crackle + fanfare run, two hits, a riser, then a big held finale
export function playCelebration() {
  const ac = audio()
  if (!ac) return
  const comp = ac.createDynamicsCompressor()
  comp.threshold.value = -14
  comp.knee.value = 8
  comp.ratio.value = 4
  comp.attack.value = 0.003
  comp.release.value = 0.2
  const out = ac.createGain()
  out.gain.value = 1.1
  out.connect(comp).connect(ac.destination)
  const t = ac.currentTime + 0.03

  // party poppers
  thump(ac, out, t, 1)
  for (let i = 0; i < 6; i++) pop(ac, out, t + i * 0.045 + Math.random() * 0.02, 0.75 - i * 0.08)

  // fanfare run C-E-G-C
  const run = [523.25, 659.25, 783.99, 1046.5]
  run.forEach((f, i) => {
    tone(ac, out, f, t + 0.06 + i * 0.09, 0.22, "square", 0.08)
    tone(ac, out, f, t + 0.06 + i * 0.09, 0.28, "triangle", 0.18)
  })

  // hit 1
  const h1 = t + 0.5
  thump(ac, out, h1, 0.8)
  pop(ac, out, h1, 0.6)
  chord(ac, out, [523.25, 659.25, 783.99, 1046.5], h1, 0.5)
  sparkles(ac, out, h1 + 0.05, 6, 0.07)

  // hit 2, a step up (F major) for lift
  const h2 = t + 1.05
  thump(ac, out, h2, 0.8)
  pop(ac, out, h2, 0.55)
  chord(ac, out, [698.46, 880, 1046.5, 1396.9], h2, 0.5)
  sparkles(ac, out, h2 + 0.05, 6, 0.07)

  // riser into the finale
  whoosh(ac, out, t + 1.35, 0.6, 0.3)
  ;[783.99, 987.77, 1174.7, 1567.98].forEach((f, i) => {
    tone(ac, out, f, t + 1.4 + i * 0.12, 0.2, "triangle", 0.15)
  })

  // finale: big held C major with octave bass, long sparkle tail
  const fin = t + 1.95
  thump(ac, out, fin, 1)
  for (let i = 0; i < 4; i++) pop(ac, out, fin + i * 0.05, 0.7 - i * 0.12)
  chord(ac, out, [261.63, 523.25, 659.25, 783.99, 1046.5, 1318.5], fin, 1.85, 1.1)
  tone(ac, out, 130.81, fin, 1.6, "sawtooth", 0.06)
  sparkles(ac, out, fin + 0.08, 18, 0.085)
  pop(ac, out, fin + 0.6, 0.4)
  pop(ac, out, fin + 1.1, 0.3)
}
