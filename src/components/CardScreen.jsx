import bg from "@/assets/bg.jpg"
import overlay from "@/assets/overlay.png"
import hand from "@/assets/hand.png"
import storeButtons from "@/assets/store-buttons.jpg"
import { Button } from "@/components/ui/button"
import ScratchCell from "@/components/ScratchCell"
import { BANHOT, BTN, CELLS, FACES, HBOX, pc } from "@/lib/layout"

const BTN_LABELS = ["GUARDAR MIS NÚMEROS", "QUIERO OTROS 6 NÚMEROS", "COMPARTIR POR WHATSAPP"]

// Hotspot boxes, in % of the 1024x551 store-buttons artwork
const STORE_BTNS = [
  { label: "My store gift coupon", box: { l: 4.4, t: 11.3, w: 90.9, h: 29.6 } },
  { label: "View here this week's sale circular", box: { l: 3.9, t: 44.5, w: 92.3, h: 35.4 } },
]

export default function CardScreen({
  card,
  handHidden,
  onHandHide,
  onReveal,
  onRevealAll,
  onSave,
  onAgain,
  onWhatsApp,
  onCoupon,
  onCircular,
}) {
  const found = card.rev.filter(Boolean).length
  const actions = [onSave, onAgain, onWhatsApp]
  const storeActions = [onCoupon, onCircular]

  return (
    <section aria-label="Tarjeta digital">
      <h1 className="sr-only">
        Pégate con El Dichoso. ¡Damos suerte! Esta tarjeta no ofrece premios. ¡Raspa y descubre tus 6 números de la
        suerte!
      </h1>

      <div
        className="@container relative aspect-[1380/2373] w-full select-none overflow-hidden bg-[length:100%_100%] bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* cells are keyed by card id so a new card remounts them (no fade-in) */}
        {card.nums.map((n, i) => (
          <ScratchCell
            key={`${card.id}-${i}`}
            index={i}
            num={n}
            box={CELLS[i]}
            face={FACES[i]}
            revealed={!!card.rev[i]}
            onReveal={onReveal}
            onScratchStart={onHandHide}
          />
        ))}

        <img
          className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
          src={overlay}
          alt=""
        />

        <img
          className="pointer-events-none absolute z-[4] animate-scr"
          src={hand}
          alt=""
          style={{ ...pc(HBOX), display: handHidden ? "none" : "block" }}
        />

        {BTN.map((o, i) => (
          <Button
            key={i}
            variant="hotspot"
            size="none"
            style={pc(o)}
            aria-label={BTN_LABELS[i]}
            onClick={actions[i]}
          />
        ))}

        <Button
          variant="hotspot"
          size="none"
          className="rounded-[9cqw]"
          style={pc(BANHOT)}
          aria-label="Raspa aquí tus 6 números: revelar los números restantes"
          onClick={onRevealAll}
        />
      </div>

      <div
        className="@container relative aspect-[1024/551] w-full select-none overflow-hidden bg-[length:100%_100%] bg-no-repeat"
        style={{ backgroundImage: `url(${storeButtons})` }}
      >
        {STORE_BTNS.map(({ label, box }, i) => (
          <Button
            key={i}
            variant="hotspot"
            size="none"
            className="rounded-[8cqw]"
            style={pc(box)}
            aria-label={label}
            onClick={storeActions[i]}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {found} de 6 descubiertos
      </p>
      <span className="sr-only">{card.id.slice(0, 8).toUpperCase()}</span>
    </section>
  )
}
