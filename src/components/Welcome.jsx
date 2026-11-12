import logo from "@/assets/logo.jpg"
import { Button } from "@/components/ui/button"

export default function Welcome({ onStart }) {
  return (
    <section aria-label="Bienvenida">
      <div className="flex min-h-screen flex-col items-center justify-center gap-[22px] bg-white px-2 pt-2 pb-6">
        <img
          className="block h-auto w-full max-w-[440px]"
          src={logo}
          alt="Pégate con El Dichoso ¡Damos suerte!"
        />
        <Button variant="cta" size="cta" onClick={onStart}>
          DISCOVER MY NUMBERS
        </Button>
      </div>
    </section>
  )
}
