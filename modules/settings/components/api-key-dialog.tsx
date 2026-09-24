"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"

import { UnlockForm } from "@app/settings/components/unlock-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { selectEncrypted, selectLocked, useSettingsStore } from "@app/settings/store"
import { BaseModel } from "@/modules/images/utils/ai-models"

export const providerInfo: Record<
  BaseModel['provider'],
  { label: string; placeholder: string }
> = {
  openai: { label: "ChatGPT (OpenAI)", placeholder: "sk-..." },
  google: { label: "Gemini (Google)", placeholder: "AIza..." },
}

type ApiKeyDialogProps = {
  provider: BaseModel['provider']
  open: boolean
  onOpenChange: (open: boolean) => void
  // Called once a key for `provider` is available (saved or unlocked).
  onReady: () => void
}

export const ApiKeyDialog = ({
  provider,
  open,
  onOpenChange,
  onReady,
}: ApiKeyDialogProps) => {
  const locked = useSettingsStore(selectLocked)
  const { label } = providerInfo[provider]

  const handleUnlocked = () => {
    // Unlocking may reveal a key that was already saved for this provider.
    if (useSettingsStore.getState().apiKeys[provider]) onReady()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label} API key</DialogTitle>
          <DialogDescription>
            {locked
              ? "Unlock your saved keys to generate with this model."
              : "Add your API key to generate with this model."}
          </DialogDescription>
        </DialogHeader>
        {locked ? (
          <UnlockForm onUnlocked={handleUnlocked} />
        ) : (
          <KeyForm key={provider} provider={provider} onSaved={onReady} />
        )}
      </DialogContent>
    </Dialog>
  )
}

const KeyForm = ({
  provider,
  onSaved,
}: {
  provider: BaseModel['provider']
  onSaved: () => void
}) => {
  const setApiKeys = useSettingsStore((state) => state.setApiKeys)
  const encrypted = useSettingsStore(selectEncrypted)
  const { label, placeholder } = providerInfo[provider]

  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const key = value.trim()
    if (!key) return
    setBusy(true)
    try {
      const apiKeys = useSettingsStore.getState().apiKeys
      await setApiKeys({ ...apiKeys, [provider]: key })
      onSaved()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Alert className="border-zinc-100 bg-zinc-50 text-zinc-700">
        <ShieldCheck />
        <AlertTitle>Your key never leaves your browser</AlertTitle>
        <AlertDescription>
          {encrypted
            ? "It is saved encrypted in your own browser and sent straight to the provider."
            : "It is saved only in your own browser and sent straight to the provider."}
        </AlertDescription>
      </Alert>

      <Input
        type="text"
        autoComplete="off"
        spellCheck={false}
        aria-label={`${label} API key`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={busy || !value.trim()}
          className="h-9 rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-800"
        >
          Save and generate
        </Button>
      </div>
    </form>
  )
}
