const COLORS = ["#ffd21f", "#d71920", "#fff", "#2a62ea", "#2fd45a"]

// Builds one burst of 46 pieces (called from an event handler, not render)
export function makeBurst() {
  return Array.from({ length: 46 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + "vw",
    background: COLORS[i % 5],
    animationDuration: 1.6 + Math.random() * 1.6 + "s",
    animationDelay: Math.random() * 0.5 + "s",
  }))
}

export default function Confetti({ bursts }) {
  return bursts.map((b) =>
    b.pieces.map((p) => (
      <i
        key={`${b.id}-${p.id}`}
        className="pointer-events-none fixed top-[-20px] z-[15] h-[14px] w-[10px] animate-fall"
        style={{
          left: p.left,
          background: p.background,
          animationDuration: p.animationDuration,
          animationDelay: p.animationDelay,
        }}
      />
    ))
  )
}
