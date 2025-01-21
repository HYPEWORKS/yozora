import { z } from "zod";

export const ErrorResultSchema = z.object({
  error: z.string(),
});

export type ErrorResult = z.infer<typeof ErrorResultSchema>;
