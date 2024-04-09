import { Address } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { AbiFunction } from "abitype";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "@/utils/evm";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";
import { useAlerts } from "@/context/Alerts";
import { getImplementation, isProxyContract } from "@/utils/proxies";
import { ChainName } from "@/utils/chains";

const CHAIN_NAME = PUB_CHAIN.name.toLowerCase() as ChainName;

export const useAbi = (contractAddress: Address) => {
  const { addAlert } = useAlerts();
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const { data: implementationAddress, isLoading: isLoadingImpl } = useQuery<Address | null>({
    queryKey: ["proxy-check", contractAddress, !!publicClient],
    queryFn: () => {
      if (!contractAddress || !publicClient) return null;

      return isProxyContract(publicClient, contractAddress)
        .then((isProxy) => {
          if (!isProxy) return null;
          return getImplementation(publicClient, contractAddress);
        })
        .catch(() => null);
    },
    retry: 4,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: Infinity,
  });

  const resolvedAddress = isAddress(implementationAddress) ? implementationAddress : contractAddress;

  const {
    data: abi,
    isLoading,
    error,
  } = useQuery<AbiFunction[], Error>({
    queryKey: ["abi", resolvedAddress || "", !!publicClient],
    queryFn: () => {
      if (!resolvedAddress || !isAddress(resolvedAddress) || !publicClient) {
        return Promise.resolve([]);
      }

      const abiLoader = getEtherscanAbiLoader();
      return whatsabi
        .autoload(resolvedAddress, {
          provider: publicClient,
          abiLoader,
          followProxies: false,
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
              stateMutability: item.stateMutability || "payable",
              type: item.type,
            });
          }
          functionItems.sort((a, b) => {
            const a_RO = ["pure", "view"].includes(a.stateMutability);
            const b_RO = ["pure", "view"].includes(b.stateMutability);

            if (a_RO === b_RO) return 0;
            else if (a_RO) return 1;
            else if (b_RO) return -1;
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
    case "mumbai":
      return new whatsabi.loaders.EtherscanABILoader({
        apiKey: PUB_ETHERSCAN_API_KEY,
        baseURL: "https://api-mumbai.polygonscan.com/api",
      });
    default:
      throw new Error("Unknown chain");
  }
}
