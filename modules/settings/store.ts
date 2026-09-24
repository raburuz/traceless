import { create } from "zustand"
import { persist } from "zustand/middleware"

import { createVault, openVault, seal, type Vault } from "@app/shared/lib/crypto"
import { BaseModel } from "../images/utils/ai-models"

type ApiKeys = Partial<Record<BaseModel['provider'], string>>

type SettingsState = {
  // In memory only while unlocked (or when encryption is off).
  apiKeys: ApiKeys
  // Encrypted keys. When set, plaintext keys are never written to storage.
  vault: Vault | null
  // Derived key, kept in memory only so keys can be re-encrypted on save.
  cryptoKey: CryptoKey | null
  setApiKeys: (apiKeys: ApiKeys) => Promise<void>
  enableEncryption: (passphrase: string) => Promise<void>
  disableEncryption: () => void
  unlock: (passphrase: string) => Promise<boolean>
  lock: () => void
  eraseKeys: () => void
}

export const selectEncrypted = (state: SettingsState) => state.vault !== null
export const selectLocked = (state: SettingsState) =>
  state.vault !== null && state.cryptoKey === null

// Persisted only in the user's own browser (localStorage). Never sent to a server.
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      vault: null,
      cryptoKey: null,

      setApiKeys: async (apiKeys) => {
        const { vault, cryptoKey } = get()
        if (!vault) {
          set({ apiKeys })
          return
        }
        if (!cryptoKey) throw new Error("Keys are locked")
        set({ apiKeys, vault: await seal(cryptoKey, vault.salt, apiKeys) })
      },

      enableEncryption: async (passphrase) => {
        const { vault, key } = await createVault(passphrase, get().apiKeys)
        set({ vault, cryptoKey: key })
      },

      disableEncryption: () => {
        if (get().cryptoKey) set({ vault: null, cryptoKey: null })
      },

      unlock: async (passphrase) => {
        const { vault } = get()
        if (!vault) return true
        try {
          const { value, key } = await openVault<ApiKeys>(vault, passphrase)
          set({ apiKeys: value, cryptoKey: key })
          return true
        } catch {
          return false
        }
      },

      lock: () => {
        if (get().vault) set({ apiKeys: {}, cryptoKey: null })
      },

      // For a forgotten passphrase: the keys can't be recovered, so wipe them.
      eraseKeys: () => set({ apiKeys: {}, vault: null, cryptoKey: null }),
    }),
    {
      name: "api-keys",
      partialize: (state) => ({
        vault: state.vault,
        apiKeys: state.vault ? {} : state.apiKeys,
      }),
    }
  )
)
