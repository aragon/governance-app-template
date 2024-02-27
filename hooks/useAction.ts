import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";
import { Action } from "@/utils/types";
import { whatsabi } from "@shazow/whatsabi";
import { Address, Hex, decodeFunctionData } from "viem";

const UNKNOWN_SIGNATURE = "(uunknown function signature)";

export type ABIFunction = Awaited<ReturnType<typeof whatsabi.autoload>>["abi"][number];

export function useAction(action: Action) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });
  const [loading, setLoading] = useState(true);
  const [functionName, setFunctionName] = useState<string | null>(null);
  const [functionSignature, setFunctionSignature] = useState<string | null>(
    null
  );
  const [functionAbi, setFunctionAbi] = useState<ABIFunction | null>(null);
  const [actionArgs, setActionArgs] = useState<
    (string | Hex | Address | number | bigint | boolean)[]
  >([]);

  useEffect(() => {
    if (!publicClient) return;
    else if (!action.data || action.data === "0x") {
      setLoading(false);
      setFunctionName(null);
      setFunctionSignature(null);
      setActionArgs([]);
      return;
    }

    setLoading(true);

    const abiLoader = new whatsabi.loaders.EtherscanABILoader({
      apiKey: PUB_ETHERSCAN_API_KEY,
    });

    whatsabi
      .autoload(action.to, {
        provider: publicClient,
        abiLoader,
        followProxies: true,
      })
      .then(({ abi }): any => {
        const func = abi.find(
          (item) =>
            item.type === "function" && action.data.startsWith(item.selector)
        );
        if (!func || func.type !== "function") {
          throw new Error(
            "Could not find a matching function within the expected contract's ABI"
          );
        }
        setFunctionAbi(func);

        setFunctionSignature(func.sig ?? UNKNOWN_SIGNATURE);

        const { args, functionName } = decodeFunctionData({
          abi,
          data: action.data as Hex,
        });
        setFunctionName(functionName);
        setActionArgs(
          args as any as (string | Hex | Address | number | bigint | boolean)[]
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [action.data, action.to, !!publicClient]);

  return {
    isLoading: loading,
    isEthTransfer: !action.data || action.data === "0x",
    functionName,
    functionAbi,
    functionSignature,
    args: actionArgs,
  };
}
