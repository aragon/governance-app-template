import { Address } from "viem";

export type DelegateAnnounce = {
  logIndex: number;
  delegate: Address;
  dao: Address;
  message: string;
};
