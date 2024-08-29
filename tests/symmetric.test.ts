import { expect, test, describe, beforeAll } from "bun:test";
import { decryptBytes, decryptString, encrypt, generateSymmetricKey } from "../utils/encryption/symmetric";
import libsodium from "libsodium-wrappers";

describe("Symmetric encryption", () => {
  beforeAll(async () => {
    await libsodium.ready;
  });

  test("Generates a random symmetric key", () => {
    const key1 = generateSymmetricKey();
    const key2 = generateSymmetricKey();

    expect(libsodium.to_hex(key1)).not.toBe(libsodium.to_hex(key2));
  });

  test("Encrypts and decrypts a string", () => {
    const symKey = generateSymmetricKey();
    const encryptedPayload = encrypt("Hello world", symKey);

    expect(libsodium.to_hex(encryptedPayload)).toMatch(/^[0-9a-fA-F]+$/);
    expect(encryptedPayload.length).toBe(51);

    const decrypted = decryptString(encryptedPayload, symKey);
    expect(decrypted).toBe("Hello world");

    const decryptedHex = decryptBytes(encryptedPayload, symKey);
    expect(libsodium.to_hex(decryptedHex)).toBe("48656c6c6f20776f726c64");
  });

  test("Encrypts and decrypts a buffer", () => {
    const symKey = generateSymmetricKey();
    const bytes = new Uint8Array([10, 15, 50, 55, 80, 85]);
    const encryptedPayload = encrypt(bytes, symKey);

    expect(libsodium.to_hex(encryptedPayload)).toMatch(/^[0-9a-fA-F]+$/);
    expect(encryptedPayload.length).toBe(46);

    const decryptedHex = decryptBytes(encryptedPayload, symKey);
    expect(libsodium.to_hex(decryptedHex)).toBe("0a0f32375055");
  });

  test("Incorrect keys can't decrypt", () => {
    const symKey = generateSymmetricKey();
    const wrongKey = generateSymmetricKey();

    const bytes = new Uint8Array([10, 15, 50, 55, 80, 85]);
    const encryptedPayload1 = encrypt(bytes, symKey);
    const encryptedPayload2 = encrypt("Hello world", symKey);

    expect(() => decryptBytes(encryptedPayload1, symKey)).not.toThrow();
    expect(() => decryptString(encryptedPayload2, symKey)).not.toThrow();

    try {
      decryptBytes(encryptedPayload1, wrongKey);
      throw new Error("Should have thrown but didn't");
    } catch (err: any) {
      expect(err.message).toBe("wrong secret key for the given ciphertext");
    }

    try {
      decryptString(encryptedPayload2, wrongKey);
      throw new Error("Should have thrown but didn't");
    } catch (err: any) {
      expect(err.message).toBe("wrong secret key for the given ciphertext");
    }
  });
});
