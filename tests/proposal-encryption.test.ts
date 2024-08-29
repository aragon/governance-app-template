import { expect, test, describe, beforeAll } from "bun:test";
import { encryptProposal, encryptSymmetricKey, decryptProposal, decryptSymmetricKey } from "../utils/encryption/index";
import libsodium from "libsodium-wrappers";
import { generateSymmetricKey } from "@/utils/encryption/symmetric";
import { generateKeyPair } from "@/utils/encryption/asymmetric";

describe("Proposal data encryption", () => {
  beforeAll(async () => {
    await libsodium.ready;
  });

  test("Encrypts a proposal data with the returned random, symmetric key", () => {
    const metadata = {
      title: "Proposal",
      description: "Testing encryption",
    };
    const actionBytes = new Uint8Array([
      50, 25, 40, 200, 123, 234, 55, 26, 73, 84, 62, 162, 188, 126, 255, 0, 2, 0, 5, 1, 55, 26, 37, 82,
    ]);

    const { encrypted: data1, symmetricKey: symmetricKey1 } = encryptProposal(JSON.stringify(metadata), actionBytes);
    const { encrypted: data2, symmetricKey: symmetricKey2 } = encryptProposal(JSON.stringify(metadata), actionBytes);

    expect(libsodium.to_hex(data1.metadata)).not.toBe(libsodium.to_hex(data2.metadata));
    expect(libsodium.to_hex(data1.actions)).not.toBe(libsodium.to_hex(data2.actions));
    expect(libsodium.to_hex(symmetricKey1)).not.toBe(libsodium.to_hex(symmetricKey2));
  });

  test("The returned symmetric key decrypts the original payload", () => {
    const metadata1 = {
      title: "Proposal 1",
      description: "Testing encryption 1",
    };
    const actionBytes1 = new Uint8Array([
      50, 25, 40, 200, 123, 234, 55, 26, 73, 84, 62, 162, 188, 126, 255, 0, 2, 0, 5, 1, 55, 26, 37, 82,
    ]);
    const metadata2 = {
      title: "Proposal 2",
      description: "Testing encryption 2",
    };
    const actionBytes2 = new Uint8Array([
      0, 5, 1, 55, 26, 37, 82, 50, 25, 40, 200, 123, 234, 55, 26, 73, 84, 62, 162, 188, 126, 255, 0, 2,
    ]);

    // Encrypt
    const { encrypted: data1, symmetricKey: symmetricKey1 } = encryptProposal(JSON.stringify(metadata1), actionBytes1);
    const { encrypted: data2, symmetricKey: symmetricKey2 } = encryptProposal(JSON.stringify(metadata2), actionBytes2);

    // Decrypt
    const {
      metadata: dMetadata1,
      rawActions: dActions1,
      rawMetadata: rawMetadata1,
    } = decryptProposal<typeof metadata1>(data1, symmetricKey1);
    const {
      metadata: dMetadata2,
      rawActions: dActions2,
      rawMetadata: rawMetadata2,
    } = decryptProposal<typeof metadata2>(data2, symmetricKey2);

    // Check
    expect(dMetadata1.title).toBe(metadata1.title);
    expect(dMetadata1.description).toBe(metadata1.description);
    expect(rawMetadata1).toBe(JSON.stringify(metadata1));

    expect(dMetadata2.title).toBe(metadata2.title);
    expect(dMetadata2.description).toBe(metadata2.description);
    expect(rawMetadata2).toBe(JSON.stringify(metadata2));

    expect(libsodium.to_hex(dActions1)).toBe(libsodium.to_hex(actionBytes1));
    expect(libsodium.to_hex(dActions2)).toBe(libsodium.to_hex(actionBytes2));
  });

  test("Keys different than the original one can't decrypt the payload", () => {
    const metadata = {
      title: "Proposal title",
      description: "Proposal description",
    };
    const actionBytes = new Uint8Array([
      50, 73, 84, 62, 162, 188, 126, 255, 0, 2, 25, 40, 200, 123, 234, 55, 26, 55, 26, 37, 82, 0, 5, 1,
    ]);

    // Encrypt
    const { encrypted: data, symmetricKey } = encryptProposal(JSON.stringify(metadata), actionBytes);

    const otherKeys = new Array(20).fill(0).map(() => generateSymmetricKey());

    // Decrypt
    expect(() => {
      const { metadata: dMetadata, rawActions: dActions1 } = decryptProposal<typeof metadata>(data, symmetricKey);

      expect(dMetadata.title).toBe(metadata.title);
      expect(dMetadata.description).toBe(metadata.description);

      expect(dActions1.toString()).toBe(actionBytes.toString());
    }).not.toThrow();

    for (const otherKey of otherKeys) {
      try {
        decryptProposal(data, otherKey);
        throw new Error("Should have thrown but didn't");
      } catch (err: any) {
        expect(err.message).toBe("wrong secret key for the given ciphertext");
      }
    }
  });
});

describe("Symmetric key encryption across members", () => {
  beforeAll(async () => {
    await libsodium.ready;
  });

  test("Encrypts a symmetric key for N recipients", () => {
    const symKey = generateSymmetricKey();

    const members = new Array(13).fill(0).map(() => generateKeyPair());
    const encryptedItems = encryptSymmetricKey(
      symKey,
      members.map((m) => m.publicKey)
    );

    expect(encryptedItems.length).toBe(members.length);
    encryptedItems.forEach((item) => {
      expect(item.length).toBe(80);
    });
  });

  test("Recipients can decrypt the original symmetric key", () => {
    const symKey = generateSymmetricKey();
    const hexSymKey = libsodium.to_hex(symKey);

    const members = new Array(13).fill(0).map(() => generateKeyPair());
    const encryptedItems = encryptSymmetricKey(
      symKey,
      members.map((m) => m.publicKey)
    );

    for (let i = 0; i < encryptedItems.length; i++) {
      const decryptedKey = decryptSymmetricKey(encryptedItems, members[i]);
      expect(libsodium.to_hex(decryptedKey)).toBe(hexSymKey);
    }
  });

  test("Non recipients cannot decrypt the original symmetric key", () => {
    const symKey = generateSymmetricKey();

    const members = new Array(13).fill(0).map(() => generateKeyPair());
    const intruders = new Array(members.length).fill(0).map(() => generateKeyPair());
    const encryptedItems = encryptSymmetricKey(
      symKey,
      members.map((m) => m.publicKey)
    );

    for (let i = 0; i < encryptedItems.length; i++) {
      try {
        decryptSymmetricKey(encryptedItems, intruders[i]);
        throw new Error("Should have thrown but didn't");
      } catch (err: any) {
        expect(err.message).toBe("The given keypair cannot decrypt any of the ciphertext's");
      }
    }

    for (let i = 0; i < encryptedItems.length; i++) {
      expect(() => {
        decryptSymmetricKey(encryptedItems, members[i]);
      }).not.toThrow();
    }
  });
});
