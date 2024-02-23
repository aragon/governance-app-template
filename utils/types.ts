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
}
