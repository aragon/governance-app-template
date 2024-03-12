import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/lockToVote/artifacts/OptimisticTokenVotingPlugin.sol";
import { useEffect } from "react";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useUserCanVeto(proposalId: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVeto, refetch: canVetoRefetch } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "canVeto",
    args: [proposalId, address],
  });

  useEffect(() => {
    canVetoRefetch();
  }, [blockNumber]);

  return canVeto;
}
