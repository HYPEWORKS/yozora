import { z } from "zod";

import { ErrorResultSchema } from "./Base";

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

const baseEndpointSchema = z.object({
  path: z.string(),
  methods: z.record(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]), MethodSchema),
});

type MetaEndpoint = z.infer<typeof baseEndpointSchema> & { children?: MetaEndpoint[] };

export const EndpointSchema: z.ZodType<MetaEndpoint> = baseEndpointSchema.extend({
  children: z.lazy(() => EndpointSchema.array()).optional(),
});

export type Endpoint = z.infer<typeof EndpointSchema>;

export const MockServerInputSchema = z.object({
  version: z.string(),
  port: z.number(),
  endpoints: EndpointSchema.array(),
}).or(ErrorResultSchema);

export type MockServerInput = z.infer<typeof MockServerInputSchema>;
