"use client";

import { useSyncExternalStore } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useImageStore } from "@app/images/store";
import { useDownloadImage } from "@app/images/hooks/use-download-image";

// The store is persisted in localStorage, so wait for hydration to avoid a
// server/client markup mismatch.
const useHasHydrated = () => useSyncExternalStore(
  (callback) => useImageStore.persist.onFinishHydration(callback),
  () => useImageStore.persist.hasHydrated(),
  () => false,
);

export const ImageResult = () => {

  const images = useImageStore((state) => state.images);
  const hasHydrated = useHasHydrated();
  const { downloadImage } = useDownloadImage();

  if (!hasHydrated || !images.length) return null;

  return (
    <ul className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <li
          key={image.id}
          className="overflow-hidden rounded-3xl border border-zinc-100 bg-white"
        >
          <img
            src={image.src}
            alt={image.prompt}
            className="aspect-square w-full bg-zinc-50 object-contain"
          />

          <div className="flex items-start gap-2 p-3">
            <p
              title={image.prompt}
              className="line-clamp-3 flex-1 text-sm text-zinc-600"
            >
              {image.prompt}
            </p>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Download image"
              className="rounded-full text-zinc-900"
              onClick={() => downloadImage(image)}
            >
              <Download />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
