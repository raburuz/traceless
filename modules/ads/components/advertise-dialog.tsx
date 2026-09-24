"use client"

import type { ReactNode } from "react"
import { ArrowRight, Eye, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// TODO: point this to your checkout / contact page for advertisers
const CHECKOUT_URL = "#checkout"

const MONTHLY_PRICE = 100
const TOTAL_SPOTS = 10
const SPOTS_TAKEN = 0

const spotsLeft = TOTAL_SPOTS - SPOTS_TAKEN
const soldOut = spotsLeft <= 0

type AdvertiseTriggerProps = {
  children?: ReactNode
  className?: string
  "aria-label"?: string
}

export const AdvertiseTrigger = ({
  children,
  ...props
}: AdvertiseTriggerProps) => {
  return (
    <Dialog>
      <DialogTrigger {...props}>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Advertise here</DialogTitle>
          <DialogDescription>
            Put your product in front of people who create with AI every day.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-3 text-center">
            <Users className="size-4 text-zinc-700" />
            <span className="font-semibold text-zinc-900">Creators</span>
            <span className="text-xs text-zinc-500">Making AI images</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-3 text-center">
            <Eye className="size-4 text-zinc-700" />
            <span className="font-semibold text-zinc-900">High-intent</span>
            <span className="text-xs text-zinc-500">Makers, not browsers</span>
          </div>
          <div
            className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center ${
              soldOut
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-emerald-200 bg-emerald-50 text-emerald-600"
            }`}
          >
            <Zap className="size-4" />
            <span className="font-semibold">
              {spotsLeft}/{TOTAL_SPOTS}
            </span>
            <span className="text-xs">Spots left</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-zinc-900">How it works</h3>
          <p className="text-zinc-500">
            Your product appears in the sponsor slots on the desktop sidebars,
            and as banners above and below the page on mobile.
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="font-semibold text-zinc-900">Pricing</h3>
          <p>
            <span className="font-medium text-zinc-900">Monthly rate:</span>{" "}
            <span className="text-zinc-500">
              from ${MONTHLY_PRICE}/month
            </span>
          </p>
          <p
            className={
              soldOut ? "font-medium text-orange-600" : "text-zinc-500"
            }
          >
            {soldOut
              ? "All spots are currently filled for this month."
              : `${spotsLeft} of ${TOTAL_SPOTS} spots are open right now.`}
          </p>
        </div>

        <Button
          render={<a href={CHECKOUT_URL} />}
          nativeButton={false}
          size="lg"
          className="h-10 w-full bg-zinc-900 text-white hover:bg-zinc-800"
        >
          {soldOut ? "Join the waitlist" : "Reserve a spot"} ($
          {MONTHLY_PRICE})
          <ArrowRight data-icon="inline-end" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}
