import { HatGlasses } from "lucide-react"
import { ApiKeysForm } from "@app/settings/components/api-keys-form"
import { EncryptSwitch } from "@app/settings/components/encrypt-switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const Settings = () => {
  return (
    <Dialog>
    <DialogTrigger
      aria-label="Settings"
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <HatGlasses className="size-5" strokeWidth={1.75} />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Add your own API keys to start generating images.
        </DialogDescription>
      </DialogHeader>
      <ApiKeysForm />
      <EncryptSwitch />
    </DialogContent>
  </Dialog>
  )
}
