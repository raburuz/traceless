"use client"

import { useEffect, useRef } from "react"

const INTERVAL_MS = 3000

// Horizontal scroll-snap carousel that advances by one slide on its own and
// loops back to the start. Pauses while the user is touching/hovering it.
export const AdCarousel = ({ children }: { children: React.ReactNode }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return

      const first = track.firstElementChild as HTMLElement | null
      if (!first) return

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2

      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + first.offsetWidth + gap,
        behavior: reduceMotion ? "auto" : "smooth",
      })
    }, INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [])

  const pause = () => {
    pausedRef.current = true
  }
  const resume = () => {
    pausedRef.current = false
  }

  return (
    <div
      ref={trackRef}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
      className="mx-auto flex max-w-3xl snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  )
}
