"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ApiKeyDialog } from "@app/settings/components/api-key-dialog";
import { ImagePreview } from "@/modules/images/components/image-preview";
import { FakeProgress } from "@app/images/components/fake-progress";
import { useSettingsStore } from "@app/settings/store";
import { useImage } from "@app/images/hooks/use-image";
import { useUploadImage } from "@app/images/hooks/use-upload-image";
import { getModelData, GoogleModel, ImageFormValues, ImageSchema, imageSchema, OpenaiModel } from "../utils/ai-models";
import { ModelPicker } from "./model-picker";
import { GooglePicker } from "./google-picker";
import { OpenaiPicker } from "./openai-picker";

export const ImageForm = () => {

  const imageAction = useImage();
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, control, handleSubmit, getValues, setValue } = useForm<ImageFormValues | ImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      prompt: '',
      model: 'gpt-image-2',
      background: 'auto',
      format: 'png',
      inputImages: [] as File[],
      quality: 'medium',
      resolution: '1024x1024',
      aspectRatio: '1:1',
      imageSize: '1K',
    },
  });
  const model = useWatch({ control, name: "model" });
  const referenceImages = useWatch({ control, name: "inputImages" });

  const { provider, maxInputImages } = getModelData(model);

  const keys = useSettingsStore((state) => state.apiKeys);

  const upload = useUploadImage({
    images: referenceImages,
    maxImages: maxInputImages,
    onChange: (images) => setValue("inputImages", images),
  });

  const generate = async (values: ImageSchema) => {
    const apiKey = useSettingsStore.getState().apiKeys[provider];
    if (!apiKey || isGenerating) return;

    setKeyDialogOpen(false);
    setIsGenerating(true);
    try {
      await imageAction.generateImage({
        apiKey,
        data: values,
      })
    } finally {
      setIsGenerating(false);
    }
  };

  // Only runs once the form is valid.
  const onSubmit = (values: ImageSchema) => {
    // Also covers locked keys: they're empty in memory until unlocked.
    if( isGenerating ) return;

    if ( !keys[provider] ) {
      setKeyDialogOpen(true);
      return;
    };
    generate(values);
  };

  return (
    <>
      <ImagePreview 
        images={referenceImages} 
        onRemove={upload.handleRemove}/>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onDragOver={upload.handleDragOver}
        onDragLeave={upload.handleDragLeave}
        onDrop={upload.handleDrop}
        className={`w-full rounded-3xl border p-3 text-zinc-900 transition-colors ${
          upload.isDraggingOver
            ? "border-zinc-400 border-dashed bg-zinc-50"
            : "border-zinc-100 bg-white"
        }`}
      >
        <Textarea
          placeholder="Describe your image..."
          aria-label="Prompt"
          {...register("prompt")}
          className="min-h-24 resize-none rounded-none border-0 bg-transparent px-2 py-1.5 text-base text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />

        {/* Filters */}
        <div className="mt-3 flex items-center flex-wrap gap-2">
          {maxInputImages > 0 && (
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-100 bg-zinc-50 p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={
                  referenceImages.length
                    ? `Reference images (${referenceImages.length})`
                    : "Add reference images"
                }
                className="relative h-8 w-9 rounded-full bg-white text-zinc-900 shadow-sm hover:bg-white"
                onClick={upload.handleUpload}
              >
                <Upload />
                {referenceImages.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-medium text-white">
                    {referenceImages.length}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Select model */}
          <Controller
            control={control}
            name="model"
            render={({ field }) => {
              return <ModelPicker 
                value={field.value} 
                onChange={ value => {

                  const modelData = getModelData(value);
                  
                  setValue('model', value);
                  
                  if(modelData.provider === 'openai'){
                    const data = modelData as OpenaiModel;
                    setValue( 'background', data.backgrounds[0]);
                    setValue( 'format', data.formats[0]);
                    setValue( 'quality', data.qualities[0]);
                    setValue( 'resolution', data.resolutions[0]);
                  } 

                  if( modelData.provider === 'google'){
                    const data = modelData as GoogleModel;
                    setValue( 'aspectRatio', data.aspectRatios[0] );
                    setValue( 'imageSize', data.imageSizes[0] );
                  }

                }} 
              />;
            }}
          />

          {/* openai provider */}
          {provider === 'openai' && (
            <>
              <Controller
                control={control}
                name="format"
                render={({ field }) => {
                  return <OpenaiPicker.Format model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
              <Controller
                control={control}
                name="quality"
                render={({ field }) => {
                  return <OpenaiPicker.Quality model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
              <Controller
                control={control}
                name="background"
                render={({ field }) => {
                  return <OpenaiPicker.Background model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
              <Controller
                control={control}
                name="resolution"
                render={({ field }) => {
                  return <OpenaiPicker.Resolution model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
            </>
          )}

          {/* google provider */}
          {provider === 'google' && (
            <>
              <Controller
                control={control}
                name="aspectRatio"
                render={({ field }) => {
                  return <GooglePicker.AspectRatio model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
              <Controller
                control={control}
                name="imageSize"
                render={({ field }) => {
                  return <GooglePicker.ImageSize model={model} value={field.value} onChange={field.onChange}/>;
                }}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={isGenerating}
            className="ml-auto h-10 rounded-full bg-zinc-100 px-5 text-zinc-700 hover:bg-zinc-200"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>

        <ApiKeyDialog
          provider={provider}
          open={keyDialogOpen}
          onOpenChange={setKeyDialogOpen}
          onReady={() => generate(imageSchema.parse(getValues()))}
        />
      </form>

      <FakeProgress active={isGenerating} />
    </>
  );
};
