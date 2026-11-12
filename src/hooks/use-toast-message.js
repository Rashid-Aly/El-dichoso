import { useCallback, useEffect, useRef, useState } from "react"

// Tiny pill toast: shows for 2.8s, new toast resets the timer
export function useToastMessage() {
  const [message, setMessage] = useState("")
  const [on, setOn] = useState(false)
  const timer = useRef(null)

  const toast = useCallback((text) => {
    setMessage(text)
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), 2800)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { message, on, toast }
}
