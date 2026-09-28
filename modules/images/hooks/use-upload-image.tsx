import { DragEvent, useState } from "react";
import { compressImage, uploadImages } from "@/modules/images/utils/images";

export const useUploadImage = (
  props: {
    images: File[],
    maxImages: number,
    onChange: ( images: File[] ) => void,
  }
) => {

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Compressed on selection so the form validates (and previews) what will be sent.
  const compressImages = ( files: File[] ) => Promise.all(files.map((file) => compressImage(file)));

  const handleUpload = async () => {
    const images = await compressImages(await uploadImages());
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

    const images = await compressImages(files);
    props.onChange([...props.images, ...images].slice(0, props.maxImages));
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
