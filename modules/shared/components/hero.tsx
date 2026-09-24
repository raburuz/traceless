"use client"

import { ArrowDown, KeyRound, Lock, ServerOff, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

const providers = ["ChatGPT", "Gemini", "Nano Banana", "+ your key"]

const pillars = [
  {
    icon: KeyRound,
    title: "Your keys, your control",
    description:
      "Paste your ChatGPT, Gemini or any other key. It's stored only in your browser.",
  },
  {
    icon: ServerOff,
    title: "Zero database",
    description:
      "No accounts, no server storing anything. Not your prompts, not your images, not your keys.",
  },
  {
    icon: ShieldCheck,
    title: "Straight to the provider",
    description:
      "Your browser talks to OpenAI or Google. Nobody in the middle.",
  },
]

export const Hero = () => {

  return (
    <div
      className="grid w-full transition-[grid-template-rows,opacity] duration-700 ease-in-out motion-reduce:transition-none"
    >
      <div className="min-h-0 overflow-hidden">
        <section className="flex w-full flex-col items-center pb-16 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
        <Lock className="size-3.5" />
        0 accounts · 0 databases · 0 traces
      </div>

      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
        Create AI images.
        <br />
        <span className="rounded-lg bg-zinc-100 px-2">
          Nobody saves a thing.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-balance text-base text-zinc-500 sm:text-lg">
        Bring your own keys and generate without signing up. Everything lives
        in your browser: close the tab and only what you choose to keep
        remains.
      </p>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {providers.map((provider) => (
          <li
            key={provider}
            className="rounded-full border border-zinc-100 bg-white px-3 py-1 text-sm text-zinc-700"
          >
            {provider}
          </li>
        ))}
      </ul>

      <Button
        render={<a href="#create" />}
        nativeButton={false}
        size="lg"
        className="mt-8 h-11 rounded-full bg-zinc-900 px-6 text-base text-white hover:bg-zinc-800"
      >
        Start creating
        <ArrowDown data-icon="inline-end" />
      </Button>
      <p className="mt-3 text-xs text-zinc-400">
        All you need is an API key. No sign-up.
      </p>

      <div className="mt-14 grid w-full gap-3 text-left sm:grid-cols-3">
        {pillars.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-zinc-100 bg-white p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-600">
              <Icon className="size-4.5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-zinc-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>
        ))}
      </div>
        </section>
      </div>
    </div>
  )
}
