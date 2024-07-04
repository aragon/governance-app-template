import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { useEffect } from "react";
import {
  PUB_CHAIN,
  PUB_TOUCAN_RECEIVER_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
} from "@/constants";
import { ToucanReceiverAbi } from "../artifacts/ToucanReceiver.sol";
import { optimismSepolia } from "viem/chains";

export function useUserCanVote(proposalId: string) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: proposalRef } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_RECEIVER_ADDRESS,
    abi: ToucanReceiverAbi,
    functionName: "getProposalRef",
    args: [BigInt(proposalId)],
  });

  const { data: canVoteL2, refetch: refreshCanVoteL2 } = useReadContract({
    chainId: optimismSepolia.id,
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [proposalRef!, address!, { abstain: 1n, yes: 0n, no: 0n }],
    query: { enabled: !!address && proposalRef !== undefined },
  });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [BigInt(proposalId), address!, { abstain: 1n, yes: 0n, no: 0n }],
    query: { enabled: !!address },
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber]);

  return canVote || canVoteL2;
}
