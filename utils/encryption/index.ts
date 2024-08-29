import libsodium from "libsodium-wrappers";
import {
  generateSymmetricKey,
  encrypt as symmetricEncrypt,
  decryptString as symmetricDecryptString,
  decryptBytes as symmetricDecryptBytes,
} from "./symmetric";
import { encrypt as asymmetricEncrypt, decryptBytes as asymmetricDecryptBytes, KeyPair } from "./asymmetric";
import { JsonValue } from "../types";

export type { KeyPair } from "./asymmetric";
export type SymmetricKey = Uint8Array;

export function encryptProposal(strMetadata: string, actionBytes: Uint8Array) {
  const symmetricKey = generateSymmetricKey();

  const encryptedMetadata = symmetricEncrypt(strMetadata, symmetricKey);
  const encryptedActions = symmetricEncrypt(actionBytes, symmetricKey);

  return {
    encrypted: {
      metadata: libsodium.to_base64(encryptedMetadata),
      actions: libsodium.to_base64(encryptedActions),
    },
    symmetricKey,
  };
}

/**
 * Returns a list of encrypted symKey payloads. Each position can be decrypted by the respective public key on the given list.
 * @param symKey The symmetric key to encrypt
 * @param recipientPubKeys The list of public keys to encrypt for
 * @returns
 */
export function encryptSymmetricKey(symKey: Uint8Array, recipientPubKeys: Uint8Array[]) {
  return recipientPubKeys.map((pubKey) => {
    return asymmetricEncrypt(symKey, pubKey);
  });
}

/**
 *
 * @param encryptedItems The list of encrypted symmetric keys, one of which can be decrypted by the keyPair
 * @param keyPair An object with the private and public keys
 * @returns
 */
export function decryptSymmetricKey(encryptedItems: Uint8Array[], keyPair: KeyPair | Omit<KeyPair, "keyType">) {
  for (const item of encryptedItems) {
    try {
      // Attempt to decrypt, continue on fail
      const decryptedSymKey = asymmetricDecryptBytes(item, keyPair);
      return decryptedSymKey;
    } catch (err) {
      /* empty */
    }
  }
  throw new Error("The given keypair cannot decrypt any of the ciphertext's");
}

export function decryptProposal<T = JsonValue>(
  data: { metadata: string; actions: string },
  symmetricKey: SymmetricKey
): {
  metadata: T;
  rawMetadata: string;
  rawActions: Uint8Array;
} {
  if (!data.metadata || !data.actions) throw new Error("Empty data");

  const rawMetadata = symmetricDecryptString(libsodium.from_base64(data.metadata), symmetricKey);
  const rawActions = symmetricDecryptBytes(libsodium.from_base64(data.actions), symmetricKey);
  return { metadata: JSON.parse(rawMetadata), rawMetadata, rawActions };
}
