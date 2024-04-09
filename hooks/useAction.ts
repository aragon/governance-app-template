import { useEffect, useState } from "react";
import { Action } from "@/utils/types";
import { AbiFunction, Address, Hex, decodeFunctionData, toFunctionSelector } from "viem";
import { useAbi } from "./useAbi";

type EvmValue = string | Hex | Address | number | bigint | boolean;

export function useAction(action: Action) {
  const { abi, isLoading } = useAbi(action.to as Address);
  const [functionName, setFunctionName] = useState<string | null>(null);
  const [functionAbi, setFunctionAbi] = useState<AbiFunction | null>(null);
  const [actionArgs, setActionArgs] = useState<EvmValue[]>([]);

  useEffect(() => {
    const hexSelector = action.data.slice(0, 10) as Hex;
    const func = abi.find((item) => item.type === "function" && hexSelector === toFunctionSelector(item));
    if (!func || func.type !== "function") return;

    const { args, functionName } = decodeFunctionData({
      abi,
      data: action.data as Hex,
    });
    setFunctionAbi(func);
    setFunctionName(functionName);
    setActionArgs((args as any as EvmValue[]) || []);
  }, [action.data, action.to, isLoading]);

  return {
    isLoading,
    functionName,
    functionAbi,
    args: actionArgs || [],
  };
}
