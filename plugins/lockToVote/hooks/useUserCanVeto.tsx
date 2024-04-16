import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { useEffect } from "react";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";

export function useUserCanVeto(proposalId: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVeto, refetch } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: LockToVetoPluginAbi,
    functionName: "canVeto",
    args: [proposalId, address!],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (Number(blockNumber) % 2 === 0) {
      refetch();
    }
  }, [blockNumber]);

  return { canVeto, refetch };
}
