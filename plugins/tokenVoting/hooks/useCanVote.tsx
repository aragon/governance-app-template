import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingAbi } from "../artifacts/TokenVoting.sol";
import { useEffect } from "react";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";

export function useCanVote(proposalId: number) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [BigInt(proposalId), address!, 1],
    query: { enabled: !!address },
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber]);

  return canVote;
}
