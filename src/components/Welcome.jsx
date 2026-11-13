import welcome from "@/assets/welcome.jpg"
import { Button } from "@/components/ui/button"
import { pc } from "@/lib/layout"

// Hotspot boxes, in % of the 682x1024 welcome artwork
const BTNS = [
  { label: "Click here to get my 6 lucky numbers", box: { l: 3.23, t: 51.76, w: 93.4, h: 11.82 } },
  { label: "My store gift coupon", box: { l: 3.23, t: 66.5, w: 93.4, h: 11.52 } },
  { label: "View here this week's sale circular", box: { l: 3.08, t: 81.15, w: 93.84, h: 13.09 } },
]

export default function Welcome({ onStart, onCoupon, onCircular }) {
  const actions = [onStart, onCoupon, onCircular]

  return (
    <section aria-label="Bienvenida">
      <h1 className="sr-only">Pégate con El Dichoso. ¡Damos suerte!</h1>

      <div
        className="@container relative aspect-[682/1024] w-full select-none overflow-hidden bg-white bg-[length:100%_100%] bg-no-repeat"
        style={{ backgroundImage: `url(${welcome})` }}
      >
        {BTNS.map(({ label, box }, i) => (
          <Button
            key={i}
            variant="hotspot"
            size="none"
            className="rounded-[8cqw] active:bg-[#00000014] focus-visible:outline-[#0a9b3a]"
            style={pc(box)}
            aria-label={label}
            onClick={actions[i]}
          />
        ))}
      </div>
    </section>
  )
}
