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

export function playCelebration() {
  const ac = audio()
  if (!ac) return
  const out = ac.createGain()
  out.gain.value = 0.7
  out.connect(ac.destination)
  const t = ac.currentTime + 0.03

  pop(ac, out, t, 0.6)
  pop(ac, out, t + 0.09, 0.45)

  // C major arpeggio up to a held chord
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    tone(ac, out, f, t + 0.08 + i * 0.1, 0.25, "square", 0.07)
    tone(ac, out, f, t + 0.08 + i * 0.1, 0.3, "triangle", 0.16)
  })
  const chord = t + 0.52
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f) => {
    tone(ac, out, f, chord, 1.1, "triangle", 0.12)
    tone(ac, out, f * 1.003, chord, 1.1, "sawtooth", 0.025)
  })

  // sparkles
  for (let i = 0; i < 10; i++) {
    tone(ac, out, 2000 + Math.random() * 2500, chord + 0.05 + i * 0.08, 0.12, "sine", 0.06)
  }
  pop(ac, out, chord + 0.25, 0.3)
}
