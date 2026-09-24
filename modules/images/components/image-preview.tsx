import { useEffect, useMemo } from "react";
import { XIcon } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type PreviewProps = {
  images: File[];
  onRemove?: (index: number) => void;
};

export const ImagePreview = ({ images, onRemove }: PreviewProps) => {
  const urls = useMemo(() => images.map((image) => URL.createObjectURL(image)), [images]);

  useEffect(() => {
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [urls]);

  if (!images.length) return null;

  return (
    <ul className="mb-3 flex w-full gap-2 overflow-x-auto pt-4">
      {urls.map((url, index) => (
        <li key={index} className="relative shrink-0">
          <HoverCard>
            <HoverCardTrigger render={<span />} className="block cursor-default">
              <img
                src={url}
                alt={`Reference image ${index + 1}`}
                className="size-16 rounded-xl border border-zinc-100 object-cover"
              />
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-1.5">
              <img
                src={url}
                alt={`Reference image ${index + 1}`}
                className="max-h-80 w-full rounded-md object-contain"
              />
            </HoverCardContent>
          </HoverCard>

          {onRemove && (
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onRemove(index)}
              className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm hover:bg-zinc-700"
            >
              <XIcon className="size-3" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};
