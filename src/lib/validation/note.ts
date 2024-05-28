import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(10, { message: "your title can't exceed 10 chars" }),
  content: z
    .string()
    .min(1, { message: "content is required" })
    .max(100, { message: "your content can't exceed 100 chars" }),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});
