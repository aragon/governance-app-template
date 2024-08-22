import { type InputValue } from "@/utils/input-values";
import { type Address, type Hex, type AbiParameter } from "viem";

export type CallParameterFieldType =
  | string
  | Hex
  | Address
  | number
  | bigint
  | boolean
  | CallParameterFieldType[]
  | { [k: string]: CallParameterFieldType };

export function resolveParamValue(value: CallParameterFieldType, abi?: AbiParameter): string {
  if (!abi?.type) {
    if (Array.isArray(value)) return value.join(", ");
    return value.toString();
  } else if (abi.type === "tuple[]") {
    const abiClone = Object.assign({}, { ...abi });
    abiClone.type = abiClone.type.replace(/\[\]$/, "");

    const items = (value as any as any[]).map((item) => resolveParamValue(item, abiClone));
    return items.join(", ");
  } else if (abi.type === "tuple") {
    const result = {} as Record<string, string>;
    const components: AbiParameter[] = (abi as any).components || [];

    for (const element of components) {
      const k = element.name!;
      result[k] = resolveParamValue((value as any)[k], element);
    }

    return getReadableJson(result);
  } else if (abi.type.endsWith("[]")) {
    return (value as any as any[]).join(", ");
  } else if (abi.type === "address") {
    return value as string;
  } else if (abi.type === "bytes32") {
    return value as string;
  } else if (abi.type.startsWith("uint") || abi.type.startsWith("int")) {
    return value.toString();
  } else if (abi.type.startsWith("bool")) {
    return value ? "Yes" : "No";
  }
  return value.toString();
}

export function resolveFieldTitle(name: string, abiType: string | undefined, idx: number): string {
  if (name) {
    if (!abiType) return name;
    else if (abiType.startsWith("uint") || abiType.startsWith("int")) {
      return name + " (in wei)";
    }
    return name;
  } else if (abiType) {
    if (abiType === "address") {
      return "Address";
    } else if (abiType === "bytes32") {
      return "Identifier";
    } else if (abiType === "bytes") {
      return "Data";
    } else if (abiType === "string") {
      return "Text";
    } else if (abiType.startsWith("uint") || abiType.startsWith("int")) {
      return "Number";
    } else if (abiType.startsWith("bool")) {
      return "Boolean";
    }
  }
  return "Parameter " + (idx + 1).toString();
}

function getReadableJson(value: Record<string, InputValue>): string {
  const items = Object.keys(value).map((k) => `${k}: ${value[k]}`);

  return `{ ${items.join(", ")} }`;
}
