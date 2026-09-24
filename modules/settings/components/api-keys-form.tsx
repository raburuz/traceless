"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"

import {
  selectEncrypted,
  selectLocked,
  useSettingsStore,
} from "@app/settings/store"
import { UnlockForm } from "@app/settings/components/unlock-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BaseModel } from "@/modules/images/utils/ai-models"

const providers: { id: BaseModel['provider']; label: string; placeholder: string }[] = [
  { id: "openai", label: "ChatGPT (OpenAI)", placeholder: "sk-..." },
  { id: "google", label: "Gemini (Google)", placeholder: "AIza..." },
]

// Mounting the fields only once unlocked lets them start from the decrypted keys.
export const ApiKeysForm = () => {
  const locked = useSettingsStore(selectLocked)
  return locked ? <UnlockForm /> : <KeysFields />
}

const KeysFields = () => {
  const apiKeys = useSettingsStore((state) => state.apiKeys)
  const setApiKeys = useSettingsStore((state) => state.setApiKeys)
  const encrypted = useSettingsStore(selectEncrypted)

  const [draft, setDraft] = useState<Record<BaseModel['provider'], string>>({
    openai: apiKeys.openai ?? "",
    google: apiKeys.google ?? "",
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await setApiKeys({
      openai: draft.openai.trim() || undefined,
      google: draft.google.trim() || undefined,
    })
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Alert className="border-zinc-100 bg-zinc-50 text-zinc-700">
        <ShieldCheck />
        <AlertTitle>Your keys never leave your browser</AlertTitle>
        <AlertDescription>
          No API key is stored on any server or database. They are saved only
          in your own browser and sent straight to the provider you choose.
        </AlertDescription>
      </Alert>

      {providers.map(({ id, label, placeholder }) => (
        <div key={id} className="flex flex-col gap-1.5">
          <label htmlFor={`key-${id}`} className="text-sm font-medium">
            {label}
          </label>
          <Input
            id={`key-${id}`}
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={draft[id]}
            onChange={(event) => {
              setDraft((prev) => ({ ...prev, [id]: event.target.value }))
              setSaved(false)
            }}
            className="h-9"
          />
        </div>
      ))}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-zinc-500">
            {encrypted ? "Saved encrypted in your browser" : "Saved in your browser"}
          </span>
        )}
        <Button
          type="submit"
          className="h-9 rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-800"
        >
          Save keys
        </Button>
      </div>
    </form>
  )
}
