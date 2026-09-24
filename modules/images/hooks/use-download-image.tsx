import { toast } from "sonner";
import { GeneratedImage } from "@/modules/images/store";

const getExtension = ( src: string ) => {
  // data:image/png;base64,... -> png
  const mediaType = src.match(/^data:image\/([a-z0-9.+-]+)[;,]/i)?.[1] ?? 'png';
  return mediaType === 'jpeg' ? 'jpg' : mediaType.replace('+xml', '');
}

const getFileName = ( image: GeneratedImage ) => {
  const slug = image.prompt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return `${slug || 'image'}-${image.createdAt}.${getExtension(image.src)}`;
}

export const useDownloadImage = () => {

  const downloadImage = async ( image: GeneratedImage ) => {
    try {
      // Blob URL instead of the data URL: some browsers block or truncate
      // large data URLs used as download links.
      const blob = await (await fetch(image.src)).blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName(image);
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Cannot download the image');
    }
  }

  return {
    downloadImage
  }
}
