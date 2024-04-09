export type Action = {
  to: string;
  value: bigint;
  data: string;
};

export interface IAlert {
  id: number;
  type: "success" | "info" | "error";
  message: string;
  description?: string;
  explorerLink?: string;
  dismissTimeout?: ReturnType<typeof setTimeout>;
}

// General types

type JsonLiteral = string | number | boolean;
export type JsonValue = JsonLiteral | Record<string, JsonLiteral> | Array<JsonLiteral>;
