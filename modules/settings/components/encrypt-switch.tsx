"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { toast } from "sonner"

import {
  selectEncrypted,
  selectLocked,
  useSettingsStore,
} from "@app/settings/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const MIN_PASSPHRASE_LENGTH = 8

export const EncryptSwitch = () => {
  const encrypted = useSettingsStore(selectEncrypted)
  const locked = useSettingsStore(selectLocked)
  const enableEncryption = useSettingsStore((state) => state.enableEncryption)
  const disableEncryption = useSettingsStore((state) => state.disableEncryption)
  const lock = useSettingsStore((state) => state.lock)

  const [setup, setSetup] = useState(false)
  const [passphrase, setPassphrase] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const closeSetup = () => {
    setSetup(false)
    setPassphrase("")
    setConfirm("")
    setError(null)
  }

  const handleChange = (checked: boolean) => {
    if (checked) {
      setSetup(true)
      return
    }
    if (!encrypted) {
      closeSetup()
      return
    }
    disableEncryption()
    toast.warning("Encryption turned off", {
      description:
        "Your API keys are now stored unencrypted in this browser. Anyone with access to it can read them.",
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (passphrase.length < MIN_PASSPHRASE_LENGTH) {
      setError(`Use at least ${MIN_PASSPHRASE_LENGTH} characters.`)
      return
    }
    if (passphrase !== confirm) {
      setError("Passphrases don't match.")
      return
    }

    setBusy(true)
    try {
      await enableEncryption(passphrase)
      toast.success("Your keys were encrypted successfully")
      closeSetup()
    } catch {
      setError("Couldn't encrypt your keys. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <label htmlFor="encrypt-keys" className="text-sm font-medium">
              Encrypt keys
            </label>
            <Badge className="bg-emerald-50 text-emerald-700">Recommended</Badge>
          </div>
          <p className="text-sm text-zinc-500">
            {locked
              ? "Unlock your keys above to turn this off."
              : encrypted
                ? "Encrypted with your passphrase. They lock when you reload the page."
                : "Protect your saved API keys with a passphrase."}
          </p>
        </div>
        <Switch
          id="encrypt-keys"
          checked={encrypted || setup}
          disabled={busy || locked}
          onCheckedChange={handleChange}
        />
      </div>

      {encrypted && !locked && (
        <Button
          type="button"
          variant="outline"
          onClick={lock}
          className="h-9 self-start rounded-full px-4"
        >
          <Lock data-icon="inline-start" />
          Lock now
        </Button>
      )}

      {setup && !encrypted && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="text-sm text-zinc-500">
            There is no way to recover your keys if you forget the passphrase.
          </p>
          <Input
            type="password"
            autoComplete="new-password"
            aria-label="Passphrase"
            placeholder="Passphrase"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="h-9"
          />
          <Input
            type="password"
            autoComplete="new-password"
            aria-label="Confirm passphrase"
            placeholder="Confirm passphrase"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="h-9"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={closeSetup}
              className="h-9 rounded-full px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="h-9 rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-800"
            >
              {busy ? "Encrypting..." : "Encrypt"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
