"use client";

import { cn } from "cn";
import { FormPicker } from "@/modules/shared/components/picker";
import { getModelData, GoogleModelId, ModelId } from "../utils/ai-models";
import { AspectRatioIcon } from "./aspect-ratio-icon";

export const GooglePicker = {
  ImageSize: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;

    const data = getModelData(model as GoogleModelId);

    return (
      <FormPicker
        title="Resolution"
        items={data.imageSizes}
        current={value}
        containerListClassname="grid-cols-4"
        render={ item => (
          <>
            <span>{item}</span>
          </>
        )}
        onChange={onChange}
      />
    );
  },

  AspectRatio: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;

    const data = getModelData(model as GoogleModelId);
    return (
      <FormPicker
        title="Aspect Ratio"
        items={data.aspectRatios}
        current={value}
        containerListClassname="grid-cols-3"
        icon={
          <AspectRatioIcon ratio={value} className="text-zinc-500" />
        }
        render={ item => (
          <>
            <span className="flex items-center gap-1.5">
              <AspectRatioIcon 
                ratio={item} 
                className={cn(item === value ? "text-zinc-900" : "text-zinc-400")}
              />
              {item}
            </span>
          </>
        )}
        onChange={onChange}
      />
    );
  },
  
}
