import { cn } from "cn";
import { aspectRatios } from "../utils/ui";

export const AspectRatioIcon = (
  props: {
    ratio: string,
    className?: string,
  }
) => {

  const value = aspectRatios[props.ratio] ?? 1;
  const size = 16;
  const width = value >= 1 ? size : size * value;
  const height = value >= 1 ? size / value : size;

  return (
    <div className={cn("flex size-3.5 shrink-0 items-center justify-center", props.className)}>
      <div
        className="rounded-xs border-[1.5px] border-current"
        style={{ width, height }}
      />
    </div>
  );
};
