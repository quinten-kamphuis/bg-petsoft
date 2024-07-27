import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(3),
  ownerName: z.string().max(50),
  imageUrl: z.union([
    z.literal(""),
    z.string().url({ message: "Invalid URL" }),
  ]),
  age: z.coerce.number().int().positive().max(999),
  notes: z.union([z.literal(""), z.string().trim().max(1000)]),
});

export type FormDataType = z.infer<typeof petFormSchema>;

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthDataType = z.infer<typeof authSchema>;