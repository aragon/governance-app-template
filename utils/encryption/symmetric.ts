import sodium from "libsodium-wrappers";
import { concatenate } from "./util";

const SYM_KEY_LENGTH = 32;

export function encrypt(message: string | Uint8Array, symmetricKey: Uint8Array) {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  return concatenate([nonce, sodium.crypto_secretbox_easy(message, nonce, symmetricKey)]);
}

export function decryptString(nonceAndCiphertext: Uint8Array, symmetricKey: Uint8Array) {
  const bytes = decryptBytes(nonceAndCiphertext, symmetricKey);
  return sodium.to_string(bytes);
}

export function decryptBytes(nonceAndCiphertext: Uint8Array, symmetricKey: Uint8Array) {
  const minLength = sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES;
  if (nonceAndCiphertext.length < minLength) {
    throw "Invalid encrypted payload";
  }

  const nonce = nonceAndCiphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = nonceAndCiphertext.slice(sodium.crypto_secretbox_NONCEBYTES);

  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, symmetricKey, "uint8array");
}

// Key helpers

export function generateSymmetricKey(size: number = SYM_KEY_LENGTH) {
  return sodium.randombytes_buf(size, "uint8array");
}
