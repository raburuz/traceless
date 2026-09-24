import { KeyRound, Lock, Megaphone, ServerOff, Sparkles } from "lucide-react"

import { AdvertiseTrigger } from "@app/ads/components/advertise-dialog"
import { BRAND_NAME, Brand } from "@app/shared/components/brand"

const promises = [
  { icon: KeyRound, label: "Keys stay in your browser" },
  { icon: ServerOff, label: "No database" },
  { icon: Lock, label: "No accounts" },
]

const linkClassName =
  "inline-flex cursor-pointer items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"

export const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-3xl px-3 pb-10">
      <div className="rounded-2xl border border-zinc-100 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-xs flex-col gap-3">
            <Brand />
            <p className="text-sm text-zinc-500">
              Create AI images with your own keys. Nobody saves a thing.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <a href="#create" className={linkClassName}>
              <Sparkles className="size-3.5" />
              Start creating
            </a>
            <AdvertiseTrigger className={linkClassName}>
              <Megaphone className="size-3.5" />
              Advertise
            </AdvertiseTrigger>
          </nav>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {promises.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-100 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
            >
              <Icon className="size-3.5" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-1 border-t border-zinc-100 pt-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {BRAND_NAME}. 0 accounts · 0 databases · 0 traces.</span>
          <span>Your browser talks straight to OpenAI or Google.</span>
        </div>
      </div>
    </footer>
  )
}
