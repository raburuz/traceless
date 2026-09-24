import { Megaphone } from "lucide-react"

import { AdCarousel } from "@app/ads/components/ad-carousel"
import { AdvertiseTrigger } from "@app/ads/components/advertise-dialog"

const COLUMN_SLOTS = 5
const STRIP_SLOTS = 5

const slotClassName =
  "shrink-0 cursor-pointer rounded-2xl border-2 border-dashed border-zinc-200 transition-colors hover:border-zinc-300 hover:bg-white focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

const AdvertiseLink = ({ className = "" }: { className?: string }) => (
  <AdvertiseTrigger
    className={`flex cursor-pointer items-center gap-1.5 py-2 text-xs text-zinc-500 transition-colors hover:text-zinc-800 ${className}`}
  >
    <Megaphone className="size-3.5" />
    Advertise
  </AdvertiseTrigger>
)

// Desktop (xl+): fixed vertical column on the left or right edge.
export const AdColumn = ({ side }: { side: "left" | "right" }) => {
  return (
    <aside
      aria-label="Advertisements"
      className={`fixed inset-y-0 hidden w-44 flex-col gap-3 overflow-y-auto bg-zinc-50/60 p-3 md:flex xl:w-56 ${
        side === "left"
          ? "left-0 border-r border-zinc-100"
          : "right-0 border-l border-zinc-100"
      }`}
    >
      {Array.from({ length: COLUMN_SLOTS }, (_, i) => (
        <AdvertiseTrigger
          key={i}
          aria-label="Advertise here"
          className={`h-52 ${slotClassName}`}
        />
      ))}

      <AdvertiseLink className="mx-auto mt-auto" />
    </aside>
  )
}

// Mobile (below md): sticky auto-scrolling carousels pinned to the top and
// bottom of the viewport.
export const AdStrip = ({ position }: { position: "top" | "bottom" }) => {
  const isTop = position === "top"

  return (
    <aside
      aria-label="Advertisements"
      className={`sticky z-40 w-full bg-zinc-50/95 px-3 py-2 backdrop-blur md:hidden ${
        isTop ? "top-0 border-b border-zinc-100" : "bottom-0 border-t border-zinc-100"
      }`}
    >
      <AdCarousel>
        {Array.from({ length: STRIP_SLOTS }, (_, i) => (
          <AdvertiseTrigger
            key={i}
            aria-label="Advertise here"
            className={`h-16 w-32 snap-start ${slotClassName}`}
          />
        ))}
      </AdCarousel>
      {!isTop && <AdvertiseLink className="mx-auto justify-center py-1" />}
    </aside>
  )
}
