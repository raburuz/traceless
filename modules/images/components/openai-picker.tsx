"use client";

import { CheckIcon } from "lucide-react";
import { FormPicker } from "@/modules/shared/components/picker";
import { getModelData, ModelId, OpenaiModelId } from "../utils/ai-models";
import { resolutionLabels } from "../utils/ui";

export const OpenaiPicker = {
  
  Format: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;
    const data = getModelData(model as OpenaiModelId);
    return (
      <FormPicker
        title="Format"
        items={data.formats}
        current={value}
        render={ item => (
          <>
            <span>{item}</span>
            {item === value && <CheckIcon className="size-4" />}
          </>
        )}
        onChange={onChange}
      />
    );
  },
  
  Quality: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;
    const data = getModelData(model as OpenaiModelId);
    return (
      <FormPicker
        title="Quality"
        items={data.qualities}
        current={value}
        render={ item => (
          <>
            <span>{item}</span>
            {item === value && <CheckIcon className="size-4" />}
          </>
        )}
        onChange={onChange}
      />
    );
  },

  Background: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;
    const data = getModelData(model as OpenaiModelId);
    return (
      <FormPicker
        title="Background"
        items={data.backgrounds}
        current={value}
        render={ item => (
          <>
            <span>{item}</span>
            {item === value && <CheckIcon className="size-4" />}
          </>
        )}
        onChange={onChange}
      />
    );
  },

  Resolution: (
    props: {
      model: ModelId,
      value: string;
      onChange: (value: string) => void;
    }
  ) => {
    const { model, value, onChange } = props;
    const data = getModelData(model as OpenaiModelId);
    return (
      <FormPicker
        title="Resolution"
        items={data.resolutions}
        current={resolutionLabels[value]}
        containerListClassname="grid-cols-4"
        render={ item => (
          <>
            <span>{resolutionLabels[item]}</span>
          </>
        )}
        onChange={onChange}
      />
    );
  },
}
