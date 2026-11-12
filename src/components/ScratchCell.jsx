import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { pc } from "@/lib/layout"

/**
 * One gold disc with a scratch-off canvas on top.
 * Scratch >= 45% (or Enter/Space, or the hidden "Revelar" button) reveals the number.
 */
export default function ScratchCell({ index, num, box, face, revealed, onReveal, onScratchStart }) {
  const canvasRef = useRef(null)
  const live = useRef({ revealed, onReveal, onScratchStart })
  live.current = { revealed, onReveal, onScratchStart }
  const st = useRef({ down: false, n: 0, last: null })

  // paint the scratch-off face once
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv || live.current.revealed) return
    const x = cv.getContext("2d", { willReadFrequently: true })
    const im = new Image()
    im.onload = () => {
      cv.width = im.width
      cv.height = im.height
      x.drawImage(im, 0, 0)
    }
    im.src = face
  }, [face])

  const pt = (e) => {
    const cv = canvasRef.current
    const r = cv.getBoundingClientRect()
    return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height]
  }

  const dot = (p) => {
    const cv = canvasRef.current
    const x = cv.getContext("2d", { willReadFrequently: true })
    x.globalCompositeOperation = "destination-out"
    x.lineCap = x.lineJoin = "round"
    x.lineWidth = cv.width * 0.22
    x.beginPath()
    const a = st.current.last || p
    x.moveTo(a[0], a[1])
    x.lineTo(p[0], p[1])
    x.stroke()
    st.current.last = p
  }

  const check = () => {
    const cv = canvasRef.current
    if (!cv.width) return
    const x = cv.getContext("2d", { willReadFrequently: true })
    const d = x.getImageData(0, 0, cv.width, cv.height).data
    let k = 0,
      t = 0
    for (let q = 3; q < d.length; q += 16) {
      t++
      if (d[q] < 40) k++
    }
    if (k / t >= 0.45) live.current.onReveal(index)
  }

  const onPointerDown = (e) => {
    if (live.current.revealed) return
    live.current.onScratchStart()
    st.current.down = true
    e.currentTarget.setPointerCapture(e.pointerId)
    st.current.last = null
    dot(pt(e))
    e.preventDefault()
  }
  const onPointerMove = (e) => {
    if (!st.current.down) return
    dot(pt(e))
    if (++st.current.n % 6 === 0) check()
  }
  const onPointerUp = () => {
    if (!st.current.down) return
    st.current.down = false
    st.current.last = null
    check()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={revealed ? `Número ${index + 1}: ${num}` : `Círculo ${index + 1}: raspa para descubrir`}
      style={pc(box)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onReveal(index)
        }
      }}
      className="absolute z-[2] rounded-full outline-offset-[3px] focus-visible:outline-[3px] focus-visible:outline-white"
    >
      {/* gold disc + number */}
      <div className="absolute inset-0 grid place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#ffe85c,#ffbe00_75%)]">
        <span
          className={cn(
            "scale-[.8] text-[length:15.5cqw] font-black leading-none tabular-nums text-[#111]",
            "transition-transform duration-500 ease-[cubic-bezier(.2,1.6,.4,1)]",
            revealed && "scale-100"
          )}
        >
          {num}
        </span>
      </div>

      {/* scratch layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "absolute inset-0 h-full w-full cursor-grab touch-none rounded-full",
          "transition-[opacity,scale] duration-500",
          revealed && "pointer-events-none scale-[1.12] opacity-0"
        )}
      />

      {/* keyboard / screen-reader reveal */}
      <Button
        variant="reveal"
        size="none"
        tabIndex={-1}
        aria-label={`Revelar número ${index + 1}`}
        onClick={() => onReveal(index)}
      >
        Revelar número
      </Button>
    </div>
  )
}
