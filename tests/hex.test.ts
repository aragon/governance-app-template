import { expect, test, describe, beforeAll } from "bun:test";
import { hexToUint8Array, uint8ArrayToHex } from "../utils/hex";

describe("Hex encoding", () => {
  test("Converts a buffer to a hex string", () => {
    expect(uint8ArrayToHex(new Uint8Array([0, 0, 1, 1, 5, 10, 16, 64, 200, 255]))).toBe("0x00000101050a1040c8ff");
  });
  test("Converts a hex string to a buffer", () => {
    expect(hexToUint8Array("0x00000101050a1040c8ff")).toStrictEqual(
      new Uint8Array([0, 0, 1, 1, 5, 10, 16, 64, 200, 255])
    );
    expect(hexToUint8Array("0xff0101050a1040c80000")).toStrictEqual(
      new Uint8Array([255, 1, 1, 5, 10, 16, 64, 200, 0, 0])
    );
  });
  test("Encoding and decoding returns the same value", () => {
    // =>
    expect(hexToUint8Array(uint8ArrayToHex(new Uint8Array([0, 5, 1, 10, 200, 255, 100, 50, 47])))).toStrictEqual(
      new Uint8Array([0, 5, 1, 10, 200, 255, 100, 50, 47])
    );

    // <=
    expect(uint8ArrayToHex(hexToUint8Array("0x00112233445566778899aabbccddeeff"))).toBe(
      "0x00112233445566778899aabbccddeeff"
    );
  });
  test("Throw an error when odd length", () => {
    expect(() => hexToUint8Array("0x123")).toThrowError();
  });
});
