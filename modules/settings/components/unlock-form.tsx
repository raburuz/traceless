"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { toast } from "sonner"

import { useSettingsStore } from "@app/settings/store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const UnlockForm = ({ onUnlocked }: { onUnlocked?: () => void }) => {
  const unlock = useSettingsStore((state) => state.unlock)
  const eraseKeys = useSettingsStore((state) => state.eraseKeys)

  const [passphrase, setPassphrase] = useState("")
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmErase, setConfirmErase] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    const ok = await unlock(passphrase)
    setBusy(false)
    if (ok) {
      toast.success("Keys unlocked")
      onUnlocked?.()
    } else {
      setError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Alert className="border-zinc-100 bg-zinc-50 text-zinc-700">
        <Lock />
        <AlertTitle>Your keys are locked</AlertTitle>
        <AlertDescription>
          Enter your passphrase to unlock them. Decryption happens in your
          browser.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-1.5">
        <Input
          type="password"
          autoComplete="current-password"
          aria-label="Passphrase"
          placeholder="Passphrase"
          value={passphrase}
          onChange={(event) => {
            setPassphrase(event.target.value)
            setError(false)
          }}
          className="h-9"
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            Wrong passphrase.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {confirmErase ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={eraseKeys}
              className="h-9 rounded-full px-4"
            >
              Erase keys
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmErase(false)}
              className="h-9 rounded-full px-4"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirmErase(true)}
            className="h-9 rounded-full px-3 text-zinc-500"
          >
            Forgot passphrase?
          </Button>
        )}
        <Button
          type="submit"
          disabled={busy || !passphrase}
          className="h-9 rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-800"
        >
          {busy ? "Unlocking..." : "Unlock"}
        </Button>
      </div>
    </form>
  )
}
