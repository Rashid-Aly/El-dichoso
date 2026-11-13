import bg from "@/assets/bg.jpg"
import hand from "@/assets/hand.png"
import { Button } from "@/components/ui/button"
import ScratchCell from "@/components/ScratchCell"
import { ACTION_BTNS, BANHOT, CELLS, FACES, HBOX, LABELS, pc } from "@/lib/layout"
import { cn } from "@/lib/utils"

const icon = "h-[5cqw] w-[5cqw] shrink-0 drop-shadow-[0_0.25cqw_0_#0005]"

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v11m-4.5-4.5L12 14l4.5-4.5M4 16.5V20h16v-3.5" />
  </svg>
)

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 11a8 8 0 0 0-14.6-4.5M4 3.5V8h4.5M4 13a8 8 0 0 0 14.6 4.5M20 20.5V16h-4.5" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} aria-hidden="true">
    <path fill="#25d366" stroke="#fff" strokeWidth="1.6" d="M12 2.6a9.4 9.4 0 0 0-8.1 14.2L2.6 21.4l4.7-1.2A9.4 9.4 0 1 0 12 2.6z" />
    <path fill="#fff" d="M8.6 7.3c.2-.4.5-.5.8-.5h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a7 7 0 0 0 2.6 2.5c.2.1.4.1.6-.1l.6-.7c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .6-.3 1.3-.8 1.7-.6.4-1.4.6-2.3.3a10.6 10.6 0 0 1-4.7-3.1c-1.2-1.4-1.9-2.9-1.9-4 0-.7.3-1.3.7-1.6z" />
  </svg>
)

const ACTIONS = [
  {
    label: "GUARDAR MIS NÚMEROS",
    lines: ["GUARDAR", "MIS NÚMEROS"],
    Icon: DownloadIcon,
    bg: "[--fill:linear-gradient(#22a653,#0b7a32_55%,#05501f)] [--edge:#033a16] [--glow:#3dff8a99]",
  },
  {
    label: "QUIERO 6 NÚMEROS NUEVOS ($3)",
    lines: ["QUIERO 6 NUEVOS", "NÚMEROS ($3)", ""],
    Icon: RefreshIcon,
    bg: "[--fill:linear-gradient(#d8212a,#a50d14_55%,#6e070c)] [--edge:#4d0408] [--glow:#ff4d5a99]",
  },
  {
    label: "COMPARTIR POR WHATSAPP",
    lines: ["COMPARTIR", "POR WHATSAPP", ""],
    Icon: WhatsAppIcon,
    bg: "[--fill:linear-gradient(#4a3fd8,#2a1fa6_55%,#180f6e)] [--edge:#0f0950] [--glow:#8a7dff99]",
  },
];

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

        {LABELS.map(({ x, y }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-[3] -translate-x-1/2 -translate-y-1/2",
              "font-['Barlow',sans-serif] text-[length:7cqw] font-black italic leading-none text-[#e8141c]",
              "[-webkit-text-stroke:2cqw_#fff] [paint-order:stroke_fill]",
              "drop-shadow-[0_0.35cqw_0.3cqw_#0006]"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {i + 1}
          </span>
        ))}

        <img
          className="pointer-events-none absolute z-[4] animate-scr"
          src={hand}
          alt=""
          style={{ ...pc(HBOX), display: handHidden ? "none" : "block" }}
        />

        {ACTIONS.map(({ label, lines, Icon, bg }, i) => (
          <Button
            key={label}
            variant="action"
            size="none"
            className={bg}
            style={pc(ACTION_BTNS[i])}
            aria-label={label}
            onClick={actions[i]}
          >
            <Icon />
            <span>
              {lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </span>
          </Button>
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

      <p className="sr-only" aria-live="polite">
        {found} de 6 descubiertos
      </p>
      <span className="sr-only">{card.id.slice(0, 8).toUpperCase()}</span>
    </section>
  )
}
