import { ImageSchema } from "@/modules/images/utils/ai-models"
import { toast } from "sonner";
import { compressImage } from "@/modules/images/utils/images";
import { useImageStore } from "@/modules/images/store";

export const useImageApi = () => {

  const generateImage = async ( apiKey: string, body: ImageSchema ) => {

    // Multipart instead of JSON: File objects serialize to `{}` in JSON.
    const formData = new FormData();
    formData.append('apikey', apiKey);

    for (const [key, value] of Object.entries(body)) {
      if (key === 'inputImages') continue;
      formData.append(key, String(value));
    }

    for (const image of body.inputImages) {
      formData.append('inputImages', image);
    }

    const resp = await fetch('/api/image', {
      method: 'POST',
      body: formData,
    })

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.message ?? 'Failed to generate the image');
    }

    return data;

  }

  return {
    generateImage
  }


}

export const useImage = () => {

  const api = useImageApi();
  const setImage = useImageStore((state) => state.setImage);

  const generateImage = async (
    props: {
      apiKey: string,
      data: ImageSchema,
    }
  ) => {
    try {

      const inputImages = await Promise.all(
        props.data.inputImages.map( v => compressImage(v) )
      );

      const data: { image: Base64URLString } = await api.generateImage(
        props.apiKey,
        {
          ...props.data, 
          inputImages
        }
      );

      setImage({
        src: data.image,
        prompt: props.data.prompt,
      });

    } catch (error) {
      toast.error('Cannot generate the image')
    }
  }

  return {
    generateImage
  }
}