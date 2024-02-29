import { useEffect, useState, useCallback } from "react";
import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { AbiFunction } from "abitype";
import { isAddress } from "@/utils/evm";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";
import { useAlert } from "@/context/AlertContext";

export const useAbi = (contractAddress: Address) => {
  const { addAlert } = useAlert();
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });
  const [abi, setAbi] = useState<AbiFunction[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!publicClient) return;
    else if (!isAddress(contractAddress)) return;

    setIsLoading(true);
    const abiLoader = new whatsabi.loaders.EtherscanABILoader({
      apiKey: PUB_ETHERSCAN_API_KEY,
    });

    whatsabi
      .autoload(contractAddress!, {
        provider: publicClient,
        abiLoader,
        followProxies: true,
        enableExperimentalMetadata: true,
      })
      .then(({ abi }) => {
        const functionItems: AbiFunction[] = [];
        for (const item of abi) {
          if (item.type === "event") continue;

          functionItems.push({
            name: (item as any).name ?? "(function)",
            inputs: item.inputs ?? [],
            outputs: item.outputs ?? [],
            stateMutability: item.stateMutability ?? "payable",
            type: item.type,
          });
        }
        functionItems.sort((a, b) => {
          if (
            ["pure", "view"].includes(a.stateMutability) &&
            ["pure", "view"].includes(b.stateMutability)
          ) {
            return 0;
          } else if (["pure", "view"].includes(a.stateMutability)) return 1;
          else if (["pure", "view"].includes(b.stateMutability)) return -1;
          return 0;
        });
        setAbi(functionItems);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        addAlert("Cannot fetch", {
          description: "The details of the contract could not be fetched",
          type: "error",
        });
      });
  }, [contractAddress]);

  return {
    abi: abi ?? [],
    isLoading,
  };
};
