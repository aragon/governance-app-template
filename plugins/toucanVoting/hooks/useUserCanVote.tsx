import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { useEffect } from "react";
import { PUB_TOUCAN_VOTING_PLUGIN_ADDRESS } from "@/constants";

export function useUserCanVote(proposalId: string) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [BigInt(proposalId), address!, { abstain: 1n, yes: 0n, no: 0n }],
    query: { enabled: !!address },
  });

  useEffect(() => {
    refreshCanVote();
    console.log("CanVote:", canVote);
  }, [blockNumber]);

  return canVote;
}
