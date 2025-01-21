import { z } from "zod";

import { ErrorResultSchema } from "./Base";

export const QRCodeInputSchema = z.object({
  imageBlob: z.string(), // Blob URL
});

export const QRCodeOutputSchema = z.object({
  ok: z.literal(true),
}).or(ErrorResultSchema);

export type QRCodeInput = z.infer<typeof QRCodeInputSchema>;
export type QRCodeOutput = z.infer<typeof QRCodeOutputSchema>;

export const inputStringToObjectString = (input: string): string => {
  return JSON.stringify(QRCodeInputSchema.parse({
    imageBlob: input,
  }));
};

export const outputObjectStringToString = (output: string): string | Error => {
  var result = QRCodeOutputSchema.parse(JSON.parse(output));

  if ("error" in result) {
    return new Error(result.error);
  }

  return "QR Code saved!";
};
