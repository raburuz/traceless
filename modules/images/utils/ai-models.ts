import { zodImage } from "@/modules/shared/utils/validators";
import z from "zod";

export type NonEmpty<T> = readonly [T, ...T[]];
export type Resolution = `${number}x${number}`;
export type AspectRatio = `${number}:${number}`;
export type ImageFormat = 'png' | 'jpeg' | 'webp';
export type Background = 'auto' | 'opaque' | 'transparent';
export type Quality = 'auto' | 'low' | 'medium' | 'high' | 'standard' | 'hd';
export type ImageSize = '1K' | '2K' | '4K';

export type BaseModel = {
  provider: 'openai' | 'google',
  maxInputImages: number,
}

export type OpenaiModel = {
  provider: 'openai'
  resolutions: NonEmpty<Resolution>,
  formats: NonEmpty<ImageFormat>,
  backgrounds: NonEmpty<Background>,
  qualities: NonEmpty<Quality>,
} & BaseModel

export type GoogleModel = {
  provider: 'google',
  aspectRatios: NonEmpty<AspectRatio>,
  imageSizes: NonEmpty<ImageSize>;
} & BaseModel

export const supportedModels = {
  'gpt-image-2.5-sunburst': {
    resolutions: ['1024x1024', '2048x2048', '4096x4096'],
    formats: ['png', 'jpeg', 'webp'],
    backgrounds: ['auto', 'opaque', 'transparent'],
    maxInputImages: 16,
    qualities: ['medium', 'low', 'high'],
    provider: 'openai',
  },
  'gpt-image-2': {
    resolutions: ['1024x1024', '2048x2048', '4096x4096'],
    formats: ['png', 'jpeg', 'webp'],
    backgrounds: ['auto', 'opaque', 'transparent'],
    maxInputImages: 16,
    qualities: ['medium', 'low', 'high'],
    provider: 'openai',
  },
  'gemini-3-pro-image-preview': {
    aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    imageSizes: ['1K', '2K', '4K'],
    maxInputImages: 14,
    provider: 'google',
  }
} as const satisfies Record<string, GoogleModel | OpenaiModel>;

export type ModelId = keyof typeof supportedModels;

// Model ids narrowed by provider, derived from the data instead of duplicated by hand.
export type OpenaiModelId = { [K in ModelId]: typeof supportedModels[K] extends OpenaiModel ? K : never }[ModelId];
export type GoogleModelId = { [K in ModelId]: typeof supportedModels[K] extends GoogleModel ? K : never }[ModelId];

export const getModelData = <T extends OpenaiModelId | GoogleModelId>( model: T ) => {
  return supportedModels[model]
}

export const models = Object.keys(supportedModels) as [ModelId, ...ModelId[]];

const createOpenaiModelSchema = <M extends OpenaiModelId>( model: M ) => {
  const data = supportedModels[model] as OpenaiModel;

  return z.object({
    model: z.literal(model),
    prompt: z.string().trim().min(1),
    resolution: z.enum(data.resolutions),
    format: z.enum(data.formats),
    background: z.enum(data.backgrounds),
    quality: z.enum(data.qualities),
    inputImages: z.array(zodImage).max(data.maxInputImages),
  })
  .superRefine((data, ctx) => {
    if (data.background === "transparent" && data.format === "jpeg") {
      ctx.addIssue({
        code: "custom",
        path: ["format"],
        message: "Transparent backgrounds must use PNG or WebP format.",
      });
    }
  });
}

const createGoogleModelSchema = <M extends GoogleModelId>( model: M ) => {
  const data = supportedModels[model] as GoogleModel;

  return z.object({
    model: z.literal(model),
    prompt: z.string().trim().min(1),
    aspectRatio: z.enum(data.aspectRatios),
    imageSize: z.enum(data.imageSizes),
    inputImages: z.array(zodImage).max(data.maxInputImages),
  });
}

export const imageSchema = z.discriminatedUnion(
  'model',
  [
    createOpenaiModelSchema('gpt-image-2.5-sunburst'),
    createOpenaiModelSchema('gpt-image-2'),
    createGoogleModelSchema('gemini-3-pro-image-preview'),
  ]
)

export type ImageSchema = z.infer<typeof imageSchema>;

// A form always needs every field bound (register/setValue/watch), but
// ImageSchema is a discriminated union: only the fields for the current
// provider actually exist on it at a given time. This flat superset is the
// react-hook-form state shape; it's narrowed down to a real ImageSchema
// with `imageSchema.parse(...)` at submit time.
export type ImageFormValues = {
  model: ModelId;
  prompt: string;
  resolution: Resolution;
  format: ImageFormat;
  imageSize: ImageSize;
  background: Background;
  quality: Quality;
  aspectRatio: AspectRatio;
  inputImages: File[];
};