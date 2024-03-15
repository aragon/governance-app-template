import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { AbiFunction } from "abitype";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "@/utils/evm";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";
import { useAlerts } from "@/context/Alerts";

export const useAbi = (contractAddress: Address) => {
  const { addAlert } = useAlerts();
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const {
    data: abi,
    isLoading,
    error,
  } = useQuery<AbiFunction[], Error>({
    queryKey: [contractAddress || "", !!publicClient],
    queryFn: () => {
      if (!contractAddress || !isAddress(contractAddress) || !publicClient) {
        return Promise.resolve([]);
      }

      const abiLoader = new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
      });

      return whatsabi
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
          return functionItems;
        })
        .catch((err) => {
          console.error(err);
          addAlert("Cannot fetch", {
            description: "The details of the contract could not be fetched",
            type: "error",
          });
          throw err;
        });
    },
    retry: 4,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: Infinity,
  });

  return {
    abi: abi ?? [],
    isLoading,
    error,
  };
};
