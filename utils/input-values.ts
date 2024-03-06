import { AbiParameter } from "viem";
import { decodeCamelCase } from "./case";

export type InputValue =
  | string
  | boolean
  | number
  | bigint
  | Array<InputValue>
  | { [k: string]: InputValue };

export function isValidValue(
  value: InputValue,
  paramType: string,
  components?: AbiParameter[]
): boolean {
  if (!value || !paramType) return false;

  // Recursize cases

  if (paramType === "tuple[]") {
    // struct array
    if (!Array.isArray(value)) return false;
    else if (!components)
      throw new Error("The components parameter is required for tuples");

    return !value.some((item, idx) => {
      const abi = (paramAbi as any)["components"][idx];
      return !isValidValue(item, abi);
    });
  } else if (paramType.endsWith("[]")) {
    // plain array
    if (!Array.isArray(value)) return false;
    const baseType = paramType.replace(/\[\]$/, "");

    return !value.some((item) => !isValidValue(item, baseType));
  } else if (paramType === "tuple[]") {
    // struct
    if (!Array.isArray(value)) return false;
    else if (!components)
      throw new Error("The components parameter is required for tuples");

    return !value.some((item, idx) => {
      const abi = (paramAbi as any)["components"][idx];
      return !isValidValue(item, abi);
    });
  }

  // Simple cases

  switch (paramType) {
    case "address":
      if (typeof value !== "string") return false;
      return /^0x[0-9a-fA-F]{40}$/.test(value);
    case "bytes":
      if (typeof value !== "string") return false;
      return value.length % 2 === 0 && /^0x[0-9a-fA-F]*$/.test(value);
    case "string":
      return typeof value === "string";
    case "bool":
      return typeof value === "boolean";
  }

  if (paramType.match(/^bytes[0-9]{1,2}$/)) {
    if (typeof value !== "string") return false;
    return value.length % 2 === 0 && /^0x[0-9a-fA-F]+$/.test(value);
  } else if (
    paramType.match(/^uint[0-9]+$/) ||
    paramType.match(/^int[0-9]+$/)
  ) {
    return typeof value === "bigint";
  }

  throw new Error(
    "Complex types need to be checked in a higher order function. Got: " +
      paramType
  );
}

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
      return [
        "True",
        "true",
        "Yes",
        "yes",
        "False",
        "false",
        "No",
        "no",
      ].includes(value);
  }

  if (paramType.match(/^bytes[0-9]{1,2}$/)) {
    const len = parseInt(paramType.replace(/^bytes/, ""));
    if (value.length !== len * 2) return false;
    return /^0x[0-9a-fA-F]+$/.test(value);
  } else if (paramType.match(/^uint[0-9]+$/)) {
    return /^[0-9]*$/.test(value);
  } else if (paramType.match(/^int[0-9]+$/)) {
    return /^-?[0-9]*$/.test(value);
  }
  throw new Error(
    "Complex types need to be checked in a higher order function. Got: " +
      paramType
  );
}

export function handleStringValue(
  value: string,
  paramType: string
): InputValue | null {
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
  } else if (
    ["uint8", "uint16", "uint32", "int8", "int16", "int32"].includes(paramType)
  ) {
    return parseInt(value);
  } else if (
    paramType.match(/^uint[0-9]+$/) ||
    paramType.match(/^int[0-9]+$/)
  ) {
    return BigInt(value);
  }
  throw new Error(
    "Complex types need to be checked in a higher order function. Got: " +
      paramType
  );
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
