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
