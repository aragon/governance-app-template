import { isHex } from "viem";
import { RawAction } from "./types";

const numberRegex = /^[0-9]+$/;

export function decodeStrJson(strJson: string): RawAction[] {
  const actions = JSON.parse(strJson);
  if (!Array.isArray(actions)) throw new Error("Invalid body");

  const result: RawAction[] = [];
  for (const action of actions) {
    if (typeof action !== "object") throw new Error("Invalid item");
    else if (!isHex(action.to)) throw new Error("Invalid to");
    else if (action.data && !isHex(action.data)) throw new Error("Invalid data");
    else if (!!action.value && !numberRegex.test(action.value)) throw new Error("Invalid value");

    result.push({
      to: action.to,
      data: action.data || "0x",
      value: BigInt(action.value || "0"),
    });
  }
  return result;
}

export function encodeActionsAsJson(actions: RawAction[]): string {
  const result = actions.map((item) => {
    return {
      to: item.to,
      data: item.data || "0x",
      value: item.value.toString(),
    };
  });
  return JSON.stringify(result);
}
