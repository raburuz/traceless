import { DragEvent, useState } from "react";
import { uploadImages } from "@/modules/images/utils/images";

export const useUploadImage = (
  props: {
    images: File[],
    maxImages: number,
    onChange: ( images: File[] ) => void,
  }
) => {

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleUpload = async () => {
    const images = await uploadImages();
    if (images.length) {
      props.onChange(images.slice(0, props.maxImages));
    }
  };

  const handleRemove = ( index: number ) => {
    props.onChange(props.images.filter((_, i) => i !== index));
  };

  const handleDragOver = ( event: DragEvent<HTMLElement> ) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  };

  const handleDragLeave = ( event: DragEvent<HTMLElement> ) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = async ( event: DragEvent<HTMLElement> ) => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (props.maxImages === 0) return;

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!files.length) return;

    props.onChange([...props.images, ...files].slice(0, props.maxImages));
  };

  return {
    isDraggingOver,
    handleUpload,
    handleRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
