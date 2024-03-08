import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect, useState } from "react";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useUserCanVeto(proposalId: bigint, forceRefetch: boolean) {
  const { address } = useAccount();
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [userVetoed, setUserVetoed] = useState<boolean>(false)

  const { data: canVeto, refetch: canVetoRefetch, queryKey } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "canVeto",
    args: [proposalId, address],
  });

  useEffect(() => {
    if (Number(blockNumber?.toString()) % 2 === 0) {
      queryClient.invalidateQueries({ queryKey })
      canVetoRefetch();
    }
  }, [blockNumber, queryClient])

  useEffect(() => {
    if (forceRefetch && !userVetoed) {
      queryClient.invalidateQueries({ queryKey })
      canVetoRefetch();
    }
    setUserVetoed(true)
  }, [forceRefetch])

  return canVeto;
}
