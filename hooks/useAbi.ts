import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { AbiFunction } from "abitype";
import { useQuery } from "@tanstack/react-query";
import { ADDRESS_ZERO, isAddress, isContract } from "@/utils/evm";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";
import { useAlerts } from "@/context/Alerts";
import { getImplementation } from "@/utils/proxies";
import { ChainName } from "@/utils/chains";

const CHAIN_NAME = PUB_CHAIN.name.toLowerCase() as ChainName;

export const useAbi = (contractAddress: Address) => {
  const { addAlert } = useAlerts();
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const { data: implementationAddress, isLoading: isLoadingImpl } = useQuery<Address | null>({
    queryKey: ["proxy-check", contractAddress, publicClient?.chain.id],
    queryFn: () => {
      if (!contractAddress || !publicClient) return null;
      else if (!isAddress(contractAddress) || !publicClient) {
        return null;
      }

      return getImplementation(publicClient, contractAddress)
        .then((address) => {
          if (!address || address === ADDRESS_ZERO) return null;
          return address;
        })
        .catch(() => null);
    },
    retry: 6,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

  const resolvedAddress = isAddress(implementationAddress) ? (implementationAddress as Address) : contractAddress;

  const {
    data: abi,
    isLoading,
    error,
  } = useQuery<AbiFunction[], Error>({
    queryKey: ["abi", resolvedAddress || "", publicClient?.chain.id],
    queryFn: async () => {
      if (!resolvedAddress || !isAddress(resolvedAddress) || !publicClient) {
        return [];
      } else if (!(await isContract(resolvedAddress, publicClient))) {
        return [];
      }

      return whatsabi
        .autoload(resolvedAddress, {
          provider: publicClient,
          abiLoader: getEtherscanAbiLoader(),
          followProxies: false,
          enableExperimentalMetadata: true,
        })
        .then(({ abi }) => {
          const functionItems: AbiFunction[] = [];
          for (const item of abi) {
            // "event", "error", "constructor", "receive", "fallback"
            if (item.type !== "function") continue;

            functionItems.push({
              name: ((item as any).name as string) || "(unknown function)",
              inputs: item?.inputs ?? [],
              outputs: item?.outputs ?? [],
              stateMutability: item?.stateMutability || "payable",
              type: item?.type,
            });
          }
          functionItems.sort(abiSortCallback);
          return functionItems;
        })
        .catch((err) => {
          console.error(err);
          addAlert("Cannot fetch", {
            description: "The details of the contract cannot be fetched or are not publicly available",
            type: "error",
          });
          throw err;
        });
    },
    retry: 6,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: 1000 * 60 * 60 * 24 * 30,
  });

  return {
    abi: abi ?? [],
    isLoading: isLoading || isLoadingImpl,
    error,
    isProxy: !!implementationAddress,
    implementation: implementationAddress,
  };
};

function getEtherscanAbiLoader() {
  switch (CHAIN_NAME) {
    case "mainnet":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
      });
    case "polygon":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api.polygonscan.com/api",
      });
    case "arbitrum":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api.arbiscan.io/api",
      });
    case "sepolia":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api-sepolia.etherscan.io/api",
      });
    case "holesky":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api-holesky.etherscan.io/api",
      });
    case "mumbai":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api-mumbai.polygonscan.com/api",
      });
    default:
      throw new Error("Unknown chain");
  }
}

function abiSortCallback(a: AbiFunction, b: AbiFunction) {
  const a_RO = ["pure", "view"].includes(a.stateMutability);
  const b_RO = ["pure", "view"].includes(b.stateMutability);

  if (a_RO === b_RO) return 0;
  else if (a_RO) return 1;
  else if (b_RO) return -1;
  return 0;
}
