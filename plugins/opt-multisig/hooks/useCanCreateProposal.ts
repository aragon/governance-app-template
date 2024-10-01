import { useAccount, useReadContract } from "wagmi";
import { PUB_OPT_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { OptimisticMultisigPluginAbi } from "../artifacts/OptimisticMultisigPlugin";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const {
    data: canCreate,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    abi: OptimisticMultisigPluginAbi,
    address: PUB_OPT_MULTISIG_PLUGIN_ADDRESS,
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
