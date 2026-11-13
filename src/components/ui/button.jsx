import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // --- El Dichoso variants ---
        // big green "DISCOVER MY NUMBERS" button
        cta:
          "w-[calc(100%-4px)] max-w-[440px] rounded-[40px] border-[5px] border-solid border-white " +
          "bg-[linear-gradient(#22cc55,#0a9b3a)] text-white uppercase font-extrabold tracking-[.2px] " +
          "text-[length:clamp(24px,7.2vw,32px)] cursor-pointer " +
          "shadow-[0_0_0_1px_#d6f5df,0_6px_0_#087a2e,0_0_26px_6px_#6dffa066] " +
          "[text-shadow:0_2px_2px_#04401a] transition-transform duration-100 " +
          "active:translate-y-[3px] focus-visible:outline-4 focus-visible:outline-offset-[3px] focus-visible:outline-[#0a9b3a]",
        // invisible tap-zones laid over the artwork
        hotspot:
          "absolute z-[5] border-0 bg-transparent p-0 rounded-[4cqw] cursor-pointer " +
          "active:bg-[#ffffff22] focus-visible:outline-[3px] focus-visible:outline-white",
        // glossy GUARDAR / OTROS 6 / WHATSAPP buttons on the card (sizes in cqw of the card);
        // colours come from --fill / --edge / --glow set by the caller
        action:
          "absolute z-[5] flex flex-row items-center justify-center gap-[0.8cqw] px-[1.4cqw] py-0 cursor-pointer " +
          "rounded-full border-[0.6cqw] border-solid border-transparent text-white uppercase italic font-extrabold " +
          "[background:var(--fill)_padding-box,linear-gradient(#fff,#fff6e0_45%,#e9d2a6)_border-box] " +
          "text-left text-[length:3.1cqw] leading-[0.95] whitespace-nowrap [text-shadow:0_0.3cqw_0_#0006] " +
          "shadow-[inset_0_0_0_0.25cqw_#00000059,inset_0_-0.9cqw_0.7cqw_#00000047,0_0.7cqw_0_var(--edge),0_1cqw_1.2cqw_#0009,0_0_0.9cqw_#ffffffa6,0_0_1.8cqw_var(--glow)] " +
          "before:pointer-events-none before:absolute before:inset-x-[6%] before:top-[7%] before:h-[44%] before:rounded-full " +
          "before:bg-[linear-gradient(#ffffff80,#ffffff0d)] before:content-[''] [&>*]:relative " +
          "transition-[translate,box-shadow] duration-100 active:translate-y-[0.5cqw] " +
          "active:shadow-[inset_0_0_0_0.25cqw_#00000059,inset_0_-0.9cqw_0.7cqw_#00000047,0_0.2cqw_0_var(--edge),0_0.4cqw_0.6cqw_#0009,0_0_1.8cqw_var(--glow)] " +
          "focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white",
        // the little "Revelar número" a11y pill
        reveal:
          "absolute left-1/2 bottom-[-3cqw] z-[6] -translate-x-1/2 border-0 bg-white text-ink " +
          "font-[family-name:Arial,sans-serif] font-bold not-italic text-[length:3.2cqw] leading-none " +
          "rounded-[2cqw] px-[2cqw] py-[.6cqw] opacity-0 pointer-events-none " +
          "focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:outline-2 focus-visible:outline-gold",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-md",
        none: "",
        cta: "h-[62px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
