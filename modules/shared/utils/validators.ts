import z from "zod";

const MAX_BYTES = 1024 * 1024;

export const zodImage = z.instanceof(File)
    .refine((f) => f.size <= MAX_BYTES, "Image exceeds 1MB")
    .refine((f) => /^image\/(jpeg|png|webp)$/.test(f.type), "Invalid format type");
