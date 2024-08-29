import { isContract } from "@/utils/evm";
import { Address, isAddress } from "viem";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export function useIsContract(address?: Address) {
  const publicClient = usePublicClient();

  const {
    data: addressIsContract,
    isLoading,
    error,
  } = useQuery<boolean>({
    queryKey: ["address-is-contract", address, !!publicClient, publicClient?.chain.id],
    queryFn: () => {
      if (!address || !isAddress(address)) return false;
      else if (!publicClient) return false;

      return isContract(address, publicClient);
    },
    retry: 6,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    enabled: !!address && isAddress(address) && !!publicClient,
    staleTime: Infinity,
  });

  return {
    isLoading,
    error,
    isContract: addressIsContract,
  };
}
