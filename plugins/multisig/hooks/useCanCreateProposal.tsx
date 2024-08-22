import { useAccount, useReadContract } from "wagmi";
import { PUB_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const {
    data: canCreate,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    abi: MultisigPluginAbi,
    address: PUB_MULTISIG_PLUGIN_ADDRESS,
    functionName: "isMember",
    args: [address!],

    query: {
      retry: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: true,
      enabled: !!address,
      staleTime: 1000 * 60 * 5,
    },
  });

  return { canCreate, isLoading, error, refetch };
}
