import { z } from "zod";

import { ErrorResultSchema } from "../schemas/Base";
import { atom } from "jotai";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type MockDataContentType = "lorem" | "faker" | "static";

export const MockDataSchema = z.object({
  type: z.enum(["text", "json", "xml"]),
  content: z.string(),
});

export const MethodSchema = z.object({
  mockData: MockDataSchema,
  statusCode: z.number(),
  headers: z.record(z.string()).optional(),
});

export const EndpointSchema = z.object({
  path: z.string(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  mockData: z.object({
    type: z.enum(["text", "json", "xml"]),
    content: z.string(),
  }),
  statusCode: z.number(),
  headers: z.record(z.string()).optional(),
});

export type Endpoint = z.infer<typeof EndpointSchema>;

export const ProxySchema = z.object({
  url: z.string(),
});

export const MockServerInputSchema = z.object({
  version: z.string(),
  port: z.number(),
  proxy: ProxySchema.optional(),
  endpoints: EndpointSchema.array(),
});

export type MockServerInput = z.infer<typeof MockServerInputSchema>;

export const DEFAULT_MOCK_SERVER_INPUT: MockServerInput = {
  version: "1.0",
  port: 6969,
  proxy: undefined,
  endpoints: [],
};

export const ServerConfigAtom = atom<MockServerInput>(DEFAULT_MOCK_SERVER_INPUT);

export const MockServerOutputSchema = z.object({
  ok: z.boolean(),
  is_running: z.boolean().optional(),
}).or(ErrorResultSchema);

export type MockServerOutput = z.infer<typeof MockServerOutputSchema>;
