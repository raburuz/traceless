import { NextResponse } from 'next/server';
import { createOpenAI, OpenAIImageModelGenerationOptions } from '@ai-sdk/openai'
import { createGoogle } from '@ai-sdk/google';
import { generateImage, NoImageGeneratedError, APICallError } from 'ai';
import z from 'zod';
import { zodValidator } from '@app/shared/lib/zod';
import { safeHandler } from '@app/shared/utils/handlers';
import { imageSchema, ImageSchema } from '@/modules/images/utils/ai-models';

export const POST = safeHandler(
  async ( req: Request ) => {

    const formData = await req.formData();
    const body = {
      ...Object.fromEntries(formData),
      inputImages: formData.getAll('inputImages'),
    };

    // Validated separately: imageSchema is a discriminated union of the
    // domain fields only, so an `apikey` in the body would just be stripped.
    const apikey = await zodValidator(body, z.object({ apikey: z.string().min(1) }));

    const value = await zodValidator(
      body,
      imageSchema
    );

    // The AI SDK takes raw bytes (or base64), not File objects.
    const images = await Promise.all(
      value.inputImages.map(async (file) => new Uint8Array(await file.arrayBuffer()))
    );

    try {
      let imageResult: Awaited<ReturnType<typeof generateImage>>;
      //add your providers here
      switch (value.model) {
        case 'gpt-image-2.5-sunburst':
        case 'gpt-image-2': {
            const openai = createOpenAI({
              apiKey: apikey.apikey,
            })
            imageResult = await generateImage({
              model: openai.image(value.model),
              prompt: images.length !== 0
                ?
                {
                  text: value.prompt,
                  images,
                }
                :
                value.prompt,
              size: value.resolution,
              n: 1,
              maxImagesPerCall: 1,
              providerOptions: {
                "openai": {
                  "quality": value.quality,
                  "background": value.background,
                  "outputFormat": value.format,
                } satisfies OpenAIImageModelGenerationOptions,
              }
            });
          break;
        }
        case 'gemini-3-pro-image-preview': {
            const google = createGoogle({
              apiKey: apikey.apikey,
            })
            imageResult = await generateImage({
              model: google.image(value.model),
              prompt: images.length !== 0
                ?
                {
                  text: value.prompt,
                  images,
                }
                :
                value.prompt,
              aspectRatio: value.aspectRatio,
              n: 1,
              maxImagesPerCall: 1,
            });
          break;
        }
        default: {
          const exhaustive: never = value;
          throw new Error(`Unhandled model: ${(exhaustive as ImageSchema).model}`);
        }
      }

  
      const image = imageResult.image;
  
      return NextResponse.json(
        {
          image: `data:${image.mediaType};base64,${image.base64}`,
        },
        {
          status: 201,
        }
      )
      
    } catch (error) {

      if (NoImageGeneratedError.isInstance(error)) {

        return NextResponse.json(
          {
            message: 'Cannot generated the image'
          },
          {
            status: 502,
          }
        ) 
      }
      
      if(APICallError.isInstance(error)){
        const code = (error.data as any)?.error?.code;
        // Log only metadata: the full error carries the request body (prompt, images).
        console.log('APICallError', error.statusCode, code, error.message);

        return NextResponse.json(
          {
            code,
            message: error.message,
          },
          {
            status: error.statusCode,
          }
        ) 
      }

      // Logged by safeHandler.
      throw error;
      
    }
    
  }
)