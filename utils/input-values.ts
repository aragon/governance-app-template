import { decodeCamelCase } from "./case";

export type InputValue = string | boolean | number | bigint | Array<InputValue> | { [k: string]: InputValue };

export const URL_PATTERN =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]+(:[0-9]{1,5})?(\/.*)?$/i;

export const URL_WITH_PROTOCOL_PATTERN =
  /^(http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]+(:[0-9]{1,5})?(\/.*)?$/i;

export const EMAIL_PATTERN = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]+(?:\.[a-z]+)?)$/i;

export function isValidStringValue(value: string, paramType: string): boolean {
  if (!value || !paramType) return false;

  switch (paramType) {
    case "address":
      return /^0x[0-9a-fA-F]{40}$/.test(value);
    case "bytes":
      return value.length % 2 === 0 && /^0x[0-9a-fA-F]*$/.test(value);
    case "string":
      return typeof value === "string";
    case "bool":
      return ["True", "true", "Yes", "yes", "False", "false", "No", "no"].includes(value);
  }

  if (paramType.match(/^bytes[0-9]{1,2}$/)) {
    const len = parseInt(paramType.replace(/^bytes/, ""));
    if (value.length !== 2 + len * 2) return false;
    return /^0x[0-9a-fA-F]+$/.test(value);
  } else if (paramType.match(/^uint[0-9]+$/)) {
    return /^[0-9]*$/.test(value);
  } else if (paramType.match(/^int[0-9]+$/)) {
    return /^-?[0-9]*$/.test(value);
  }
  throw new Error("Complex types need to be checked in a higher order function. Got: " + paramType);
}

export function handleStringValue(value: string, paramType: string): InputValue | null {
  if (!isValidStringValue(value, paramType)) return null;

  switch (paramType) {
    case "address":
    case "bytes":
    case "string":
      return value;
    case "bool":
      return !["False", "false", "No", "no"].includes(value);
  }

  if (paramType.match(/^bytes[0-9]{1,2}$/)) {
    return value;
  } else if (["uint8", "uint16", "uint32", "int8", "int16", "int32"].includes(paramType)) {
    return parseInt(value);
  } else if (paramType.match(/^uint[0-9]+$/) || paramType.match(/^int[0-9]+$/)) {
    return BigInt(value);
  }
  throw new Error("Complex types need to be checked in a higher order function. Got: " + paramType);
}

export function readableTypeName(paramType: string): string {
  switch (paramType) {
    case "address":
      return "Address";
    case "bytes":
      return "Hexadecimal bytes";
    case "string":
      return "Text";
    case "bool":
      return "Yes or no";
  }

  if (paramType.match(/^bytes[0-9]{1,2}$/)) {
    const len = paramType.replace(/^bytes/, "");
    return "Hexadecimal bytes (" + len + ")";
  } else if (paramType.match(/^uint[0-9]+$/)) {
    return "Positive number (in wei)";
  } else if (paramType.match(/^int[0-9]+$/)) {
    return "Number (in wei)";
  }

  return decodeCamelCase(paramType.replace(/\[\]/, ""));
}
