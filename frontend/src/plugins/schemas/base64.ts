import { z } from "zod";

import { ErrorResultSchema } from "./Base";

export const Base64InputSchema = z.object({
  input: z.string(),
});

export const Base64OutputSchema = z.object({
  output: z.string(),
}).or(ErrorResultSchema);

export type Base64Input = z.infer<typeof Base64InputSchema>;
export type Base64Output = z.infer<typeof Base64OutputSchema>;

export const inputStringToObjectString = (input: string): string => {
  return JSON.stringify(Base64InputSchema.parse({ input }));
};

export const outputObjectStringToString = (output: string): string | Error => {
  var result = Base64OutputSchema.parse(JSON.parse(output));

  if ("error" in result) {
    return new Error(result.error);
  }

  return result.output;
};
