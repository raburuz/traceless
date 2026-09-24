import imageCompression, { Options } from "browser-image-compression";

const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  fileType: "image/webp",
  initialQuality: 0.85,
} satisfies Options;

export const compressImage = (file: File, options?: Options) => {
  return imageCompression(file, options ?? DEFAULT_COMPRESSION_OPTIONS);
};

export const uploadImages = (): Promise<File[]> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = () => {
      resolve(Array.from(input.files ?? []));
    };

    input.click();
  });
}
