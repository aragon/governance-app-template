import { expect, test, describe, beforeAll } from "bun:test";
import {
  decryptBytes,
  decryptString,
  encrypt,
  generateKeyPair,
  getSeededKeyPair,
  computePublicKey,
} from "../utils/encryption/asymmetric";
import libsodium from "libsodium-wrappers";

describe("Symmetric encryption", () => {
  beforeAll(async () => {
    await libsodium.ready;
  });

  test("Generates a random key pair", () => {
    const alice = generateKeyPair();
    const bob = generateKeyPair();

    expect(libsodium.to_hex(alice.keyType)).toBe(libsodium.to_hex(bob.keyType));
    expect(libsodium.to_hex(alice.privateKey)).not.toBe(libsodium.to_hex(bob.privateKey));
    expect(libsodium.to_hex(alice.publicKey)).not.toBe(libsodium.to_hex(bob.publicKey));
  });

  test("Computes the public key given the secret one", () => {
    const alice = generateKeyPair();
    const computedPubKey = computePublicKey(alice.privateKey);

    expect(libsodium.to_hex(alice.publicKey)).toBe(libsodium.to_hex(computedPubKey));
  });

  test("Generates a seeded key pair", () => {
    const alice = getSeededKeyPair("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff");
    const bob = getSeededKeyPair("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff");

    expect(libsodium.to_hex(alice.keyType)).toBe(libsodium.to_hex(bob.keyType));
    expect(libsodium.to_hex(alice.privateKey)).toBe(libsodium.to_hex(bob.privateKey));
    expect(libsodium.to_hex(alice.publicKey)).toBe(libsodium.to_hex(bob.publicKey));
  });

  test("Encrypts and decrypts a string", () => {
    const bob = generateKeyPair();
    const ciphertext = encrypt("Hello world", bob.publicKey);
    expect(ciphertext.length).toBe(59);
    const decrypted = decryptString(ciphertext, bob);
    expect(decrypted).toBe("Hello world");
    const decryptedHex = decryptBytes(ciphertext, bob);
    expect(libsodium.to_hex(decryptedHex)).toBe("48656c6c6f20776f726c64");
  });

  test("Encrypts and decrypts a buffer", () => {
    const bob = generateKeyPair();
    const bytes = new Uint8Array([10, 15, 50, 55, 80, 85]);
    const ciphertext = encrypt(bytes, bob.publicKey);
    expect(ciphertext.length).toBe(54);
    const decryptedHex = decryptBytes(ciphertext, bob);
    expect(libsodium.to_hex(decryptedHex)).toBe("0a0f32375055");
  });

  test("Unintended keys can't decrypt", () => {
    const bob = generateKeyPair();
    const cindy = generateKeyPair();

    const bytes = new Uint8Array([10, 15, 50, 55, 80, 85]);

    const ciphertext1 = encrypt(bytes, bob.publicKey);
    const ciphertext2 = encrypt("Hello world", bob.publicKey);

    // ok
    expect(() => decryptBytes(ciphertext1, bob)).not.toThrow();
    expect(() => decryptString(ciphertext2, bob)).not.toThrow();

    // ko
    try {
      decryptBytes(ciphertext1, cindy);
      throw new Error("Should have thrown but didn't");
    } catch (err: any) {
      expect(err.message).toBe("incorrect key pair for the given ciphertext");
    }

    try {
      decryptString(ciphertext2, cindy);
      throw new Error("Should have thrown but didn't");
    } catch (err: any) {
      expect(err.message).toBe("incorrect key pair for the given ciphertext");
    }
  });
});
