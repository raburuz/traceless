import imageCompression, { Options } from "browser-image-compression";

const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  fileType: "image/webp",
  initialQuality: 0.85,
} satisfies Options;

// browser-image-compression resolves a Blob with `name` patched on, not a real
// File, so it fails `z.instanceof(File)`. Wrap it back into a File.
export const compressImage = async (file: File, options?: Options) => {
  const blob = await imageCompression(file, options ?? DEFAULT_COMPRESSION_OPTIONS);
  const extension = blob.type.split("/")[1];
  const name = extension ? file.name.replace(/\.[^.]+$/, "") + `.${extension}` : file.name;
  return new File([blob], name, { type: blob.type, lastModified: file.lastModified });
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
