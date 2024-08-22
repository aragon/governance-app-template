import { Hex } from "viem";

export function uint8ArrayToHex(data: Uint8Array): Hex {
  let result: Hex = "0x";
  for (let i = 0; i < data.length; i++) {
    result = result + data[i].toString(16).padStart(2, "0");
  }
  return result;
}

export function hexToUint8Array(data: Hex): Uint8Array {
  const result: number[] = [];
  if (data.length % 2 != 0) throw new Error("Received an hex value with odd length");
  const hex = data.startsWith("0x") ? data.slice(2) : data;

  for (let i = 0; i < hex.length; i += 2) {
    let byte = parseInt(hex[i], 16) * 16;
    byte += parseInt(hex[i + 1], 16);
    result.push(byte);
  }
  return new Uint8Array(result);
}
