export type Action = {
  to: string;
  value: bigint;
  data: string;
}

export interface IAlert {
  message: string;
  txHash: string;
  id: number;
}
