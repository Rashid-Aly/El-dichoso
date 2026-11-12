import { useCallback, useEffect, useRef, useState } from "react"
import Welcome from "@/components/Welcome"
import CardScreen from "@/components/CardScreen"
import Toast from "@/components/Toast"
import Confetti, { makeBurst } from "@/components/Confetti"
import { useToastMessage } from "@/hooks/use-toast-message"
import { cn } from "@/lib/utils"
import { newCard, persist, renderCardPng, restore } from "@/lib/card"

// same boot logic as the original: restored card + #tarjeta -> go straight to the card
function boot() {
  const saved = restore()
  if (saved && location.hash === "#tarjeta") return { card: saved, screen: 2 }
  return { card: saved || newCard(), screen: 1 }
}

export default function App() {
  const [init] = useState(boot)
  const [card, setCardState] = useState(init.card)
  const [screen, setScreen] = useState(init.screen)
  const [handHidden, setHandHidden] = useState(!!init.card.rev[2])
  const [bursts, setBursts] = useState([])
  const { message, on, toast } = useToastMessage()

  // ref = source of truth, so rapid reveals (revealAll / scratching) never see a stale card
  const cardRef = useRef(init.card)
  const setCard = useCallback((c) => {
    cardRef.current = c
    setCardState(c)
  }, [])

  useEffect(() => {
    persist(card)
  }, [card])

  // original show(n): white page on welcome, #tarjeta hash, scroll to top
  useEffect(() => {
    document.body.classList.toggle("white", screen === 1)
    try {
      history.replaceState(null, "", screen === 2 ? "#tarjeta" : location.pathname + location.search)
    } catch (e) {}
    window.scrollTo(0, 0)
  }, [screen])

  useEffect(() => {
    const onHash = () => {
      if (location.hash !== "#tarjeta") setScreen(1)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const confetti = useCallback(() => {
    const id = Date.now() + Math.random()
    setBursts((b) => [...b, { id, pieces: makeBurst() }])
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 4000)
  }, [])

  const reveal = useCallback(
    (i) => {
      const c = cardRef.current
      if (c.rev[i]) return
      if (i === 2) setHandHidden(true)
      const next = { ...c, rev: c.rev.map((v, k) => (k === i ? 1 : v)) }
      setCard(next)
      if (next.rev.every(Boolean)) confetti()
    },
    [setCard, confetti]
  )

  const revealAll = () => {
    const c = cardRef.current
    const todo = c.rev.map((v, i) => [v, i]).filter(([v]) => !v)
    if (!todo.length) {
      toast("Ya descubriste tus 6 números")
      return
    }
    todo.forEach(([, i], k) =>
      setTimeout(() => {
        if (cardRef.current.id === c.id) reveal(i) // ignore if a new card was dealt meanwhile
      }, k * 260)
    )
  }

  // returns true (and warns) when not every number is revealed yet
  const need = () => {
    if (cardRef.current.rev.every(Boolean)) return false
    toast("Primero raspa o revela los 6 números")
    return true
  }

  const save = async () => {
    if (need()) return
    try {
      const b = await renderCardPng(cardRef.current)
      const f = new File([b], "mi-tarjeta-el-dichoso.png", { type: "image/png" })
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        try {
          await navigator.share({ files: [f], title: "EL DICHOSO DIGITAL" })
          return
        } catch (e) {
          if (e.name === "AbortError") return
        }
      }
      const a = document.createElement("a")
      a.href = URL.createObjectURL(b)
      a.download = f.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast("Tarjeta descargada")
    } catch (e) {
      toast("No se pudo guardar. Inténtalo de nuevo.")
    }
  }

  const whatsApp = () => {
    if (need()) return
    const link = location.origin + location.pathname
    window.open(
      "https://wa.me/?text=" +
        encodeURIComponent(
          `¡Pégate con EL DICHOSO! Descubre tus 6 números de la suerte, gratis y solo para entretenimiento: ${link}`
        ),
      "_blank",
      "noopener"
    )
  }

  const again = () => {
    const c = newCard()
    setCard(c)
    setHandHidden(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
    toast("Nueva tarjeta demo gratis")
  }

  const start = () => {
    let c = cardRef.current
    if (!c || c.rev.every(Boolean)) {
      c = newCard()
      setCard(c)
    }
    setHandHidden(!!c.rev[2])
    setScreen(2)
  }

  return (
    <>
      <div className={cn("mx-auto max-w-[460px] bg-[#0a2a9c]", screen === 1 && "bg-white")}>
        {screen === 1 ? (
          <Welcome onStart={start} />
        ) : (
          <CardScreen
            card={card}
            handHidden={handHidden}
            onHandHide={() => setHandHidden(true)}
            onReveal={reveal}
            onRevealAll={revealAll}
            onSave={save}
            onAgain={again}
            onWhatsApp={whatsApp}
          />
        )}
      </div>
      <Toast message={message} on={on} />
      <Confetti bursts={bursts} />
    </>
  )
}
