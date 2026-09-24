"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Only one sample image exists for now, so each card crops it with a
// different aspect ratio to give the masonry its uneven heights.
const EXAMPLE_IMAGE = "/example.jpeg"

type Example = {
  prompt: string
  model: string
  /** "width:height", e.g. "3:4" */
  ratio: string
}

const examples: Example[] = [
  {
    prompt: "A neon-lit street in Tokyo at night, rain reflections, cinematic",
    model: "Nano Banana",
    ratio: "3:4",
  },
  {
    prompt: "Minimalist product photo of a perfume bottle on a marble pedestal",
    model: "ChatGPT",
    ratio: "1:1",
  },
  {
    prompt: "Astronaut riding a horse on Mars, dramatic sunset, photorealistic",
    model: "Gemini",
    ratio: "2:3",
  },
  {
    prompt: "Watercolor illustration of a cozy cabin in a snowy forest",
    model: "ChatGPT",
    ratio: "4:5",
  },
  {
    prompt: "Isometric 3D render of a tiny coffee shop, soft pastel colors",
    model: "Nano Banana",
    ratio: "3:2",
  },
  {
    prompt:
      "Portrait of an elderly fisherman, golden hour, 85mm, shallow depth of field",
    model: "Gemini",
    ratio: "2:3",
  },
  {
    prompt: "Cyberpunk city skyline with flying cars, ultra detailed, 8k",
    model: "Nano Banana",
    ratio: "4:5",
  },
  {
    prompt: "Studio Ghibli style meadow with a small wooden house and clouds",
    model: "ChatGPT",
    ratio: "1:1",
  },
  {
    prompt:
      "Vintage travel poster of the Amalfi Coast, flat colors, bold typography",
    model: "Gemini",
    ratio: "3:4",
  },
]

const toCssRatio = (ratio: string) => ratio.replace(":", " / ")

export const PromptSection = () => {
  return (
    <section className="mt-20 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          See what a prompt can do
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-zinc-500 sm:text-base">
          Examples of images generated from different prompts. Click one to see
          the details and write your own.
        </p>
      </div>

      <ul className="mt-10 columns-2 gap-4 sm:columns-3">
        {examples.map((example) => (
          <li key={example.prompt} className="mb-4 break-inside-avoid">
            <Dialog>
              <DialogTrigger className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-100 text-left transition-transform duration-300 ease-out outline-none hover:z-10 hover:scale-105 hover:shadow-xl focus-visible:z-10 focus-visible:scale-105 focus-visible:shadow-xl focus-visible:ring-2 focus-visible:ring-zinc-900 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100">
                <span
                  className="relative block w-full"
                  style={{ aspectRatio: toCssRatio(example.ratio) }}
                >
                  <Image
                    src={EXAMPLE_IMAGE}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 224px, 50vw"
                    className="object-cover"
                  />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 pt-10 text-xs text-white">
                  <span className="line-clamp-3">{example.prompt}</span>
                </span>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-zinc-100"
                    style={{ aspectRatio: toCssRatio(example.ratio) }}
                  >
                    <Image
                      src={EXAMPLE_IMAGE}
                      alt={example.prompt}
                      fill
                      sizes="(min-width: 640px) 336px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <DialogHeader className="pr-8">
                      <DialogTitle className="text-lg">Prompt</DialogTitle>
                      <DialogDescription>
                        The text used to generate this image.
                      </DialogDescription>
                    </DialogHeader>

                    <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-zinc-700">
                      {example.prompt}
                    </p>

                    <dl className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                        <dt className="text-xs text-zinc-500">AI model</dt>
                        <dd className="font-semibold text-zinc-900">
                          {example.model}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                        <dt className="text-xs text-zinc-500">Aspect ratio</dt>
                        <dd className="font-semibold text-zinc-900">
                          {example.ratio}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </section>
  )
}
