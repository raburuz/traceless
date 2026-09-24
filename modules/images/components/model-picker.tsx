"use client";

import { CheckIcon } from "lucide-react";
import { FormPicker } from "@/modules/shared/components/picker";
import { ModelId, models } from "../utils/ai-models";

export const ModelPicker = 
<T extends ModelId>
(
  props: {
    value: T;
    onChange: (value: T) => void;
  }
) => {

  const { value, onChange } = props;

  return (
    <FormPicker
      title="Model"
      items={models}
      current={value}
      render={ item => (
        <>
          <span>{item}</span>
          {item === value && <CheckIcon className="size-4" />}
        </>
      )}
      onChange={ (v) => onChange(v as T)}
    />
  );
}
