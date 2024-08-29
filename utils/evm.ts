import { Address, PublicClient } from "viem";

export const isAddress = (maybeAddress: any) => {
  if (!maybeAddress || typeof maybeAddress !== "string") return false;
  else if (!maybeAddress.match(/^0x[0-9a-fA-F]{40}$/)) return false;
  return true;
};

export function equalAddresses(value1?: string, value2?: string): boolean {
  if (!value1 || !value2) return false;
  else if (!isAddress(value1) || !isAddress(value2)) return false;
  return value1.toLowerCase().trim() === value2.toLocaleLowerCase().trim();
}

export function formatHexString(address: string): string {
  if (!address || address.length < 12) {
    return address || "";
  }

  // Take the first 5 characters (including '0x') and the last 4 characters
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function isContract(address: Address, publicClient: PublicClient) {
  if (!publicClient) return Promise.reject(new Error("Invalid client"));

  return publicClient.getCode({ address }).then((bytecode) => {
    return bytecode !== undefined && bytecode !== "0x";
  });
}

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
