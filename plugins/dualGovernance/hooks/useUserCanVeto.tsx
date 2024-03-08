import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect, useState } from "react";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useUserCanVeto(proposalId: bigint, forceRefetch: boolean) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [userVetoed, setUserVetoed] = useState<boolean>(false)

  const { data: canVeto, refetch: canVetoRefetch } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "canVeto",
    args: [proposalId, address],
  });

  useEffect(() => {
    if (Number(blockNumber) % 2 === 0) {
      canVetoRefetch();
    }
  }, [blockNumber])

  useEffect(() => {
    if (forceRefetch && !userVetoed) {
      canVetoRefetch();
    }
    setUserVetoed(true)
  }, [forceRefetch])

  return canVeto;
}
