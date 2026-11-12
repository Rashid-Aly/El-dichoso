import { cn } from "@/lib/utils"

export default function Toast({ message, on }) {
  return (
    <div
      role="status"
      className={cn(
        "fixed left-1/2 bottom-[calc(18px+env(safe-area-inset-bottom,0px))] z-20 max-w-[90vw]",
        "-translate-x-1/2 translate-y-[140px] rounded-[30px] bg-white px-[18px] py-2.5 text-center",
        "font-bold not-italic text-ink transition-transform duration-300",
        on && "translate-y-0"
      )}
    >
      {message}
    </div>
  )
}
