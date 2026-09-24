import { create } from "zustand"
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware"
import { del, get, set } from "idb-keyval"

// IndexedDB instead of localStorage: base64 images quickly exceed
// localStorage's ~5MB quota, and the write fails silently.
const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: (name, value) => set(name, value),
  removeItem: (name) => del(name),
}

export type GeneratedImage = {
  id: string,
  src: Base64URLString,
  prompt: string,
  createdAt: number,
}

type ImagesState = {
  images: GeneratedImage[],
  setImage: ( image: Omit<GeneratedImage, 'id' | 'createdAt'> ) => void
}

export const useImageStore = create<ImagesState>()(
  persist(
    (set) => ({
      images: [],
      setImage: ( image ) => set( state => ({
        images: [
          { ...image, id: crypto.randomUUID(), createdAt: Date.now() },
          ...state.images,
        ]
      }))
    }),
    {
      name: 'images',
      storage: createJSONStorage(() => idbStorage),
    }
  )
)
