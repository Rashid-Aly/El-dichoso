import welcome from "@/assets/welcome.jpg"
import { Button } from "@/components/ui/button"
import { pc } from "@/lib/layout"
import { cn } from "@/lib/utils"

// Hotspot boxes, in % of the 682x1024 welcome artwork
const BTNS = [
  { label: "Click here to get my 6 lucky numbers", box: { l: 3.23, t: 51.76, w: 93.4, h: 11.82 } },
  { label: "My store gift coupon", box: { l: 3.23, t: 66.5, w: 93.4, h: 11.52 } },
  { label: "View here this week's sale circular", box: { l: 3.08, t: 81.15, w: 93.84, h: 13.09 } },
]

export default function Welcome({ onStart, onCoupon, onCircular }) {
  const actions = [onStart, onCoupon, onCircular]

  return (
    <section aria-label="Bienvenida" className="flex min-h-dvh flex-col justify-center">
      <h1 className="sr-only">Pégate con El Dichoso. ¡Damos suerte!</h1>

      <div className="@container w-full">
        <p
          className={cn(
            "mx-[3.25cqw] my-0 flex items-center justify-center whitespace-nowrap rounded-full px-[3cqw] py-[2.6cqw] text-center",
            "border-[0.7cqw] border-solid border-[#fff0a0]",
            "bg-[linear-gradient(#c58a00,#ffd21f_14%,#fff3a6_46%,#ffc400_78%,#a86f00)]",
            "shadow-[inset_0_0_0_0.3cqw_#8a5a0080,0_0.6cqw_1.2cqw_#0005]",
            "font-['Archivo_Black','Arial_Black',sans-serif] text-[length:7.4cqw] not-italic uppercase leading-none tracking-[-0.01em] text-[#0b0b0b]",
            "[text-shadow:0_0.25cqw_0_#ffffff80]"
          )}
        >
          GET LUCKY <span className="mx-[1.2cqw] text-[0.9em] [text-shadow:none]">🍀</span> TODAY
        </p>
      </div>

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
