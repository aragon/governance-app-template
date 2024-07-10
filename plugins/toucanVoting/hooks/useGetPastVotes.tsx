import { parseAbi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useProposal } from "./useProposal";
import { PUB_CHAIN, PUB_L2_CHAIN, PUB_TOKEN_L1_ADDRESS, PUB_TOKEN_L2_ADDRESS } from "@/constants";

const erc20VotesAbi = parseAbi([
  "function getPastVotes(address owner, uint256 timepoint) view returns (uint256)",
  "function getVotes(address account) view returns (uint256)",
]);

export function useProposalL1Voting(proposalId: string) {
  const { address } = useAccount();
  const { proposal } = useProposal(proposalId, true);

  const { data: votes } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOKEN_L1_ADDRESS,
    abi: erc20VotesAbi,
    functionName: "getPastVotes",
    args: [address!, proposal?.parameters.snapshotBlock ?? 0n],
    query: {
      enabled: proposal?.parameters.snapshotBlock !== undefined,
    },
  });

  return { votes };
}

export function useProposalL2Voting(proposalId: string) {
  const { address } = useAccount();
  const { proposal } = useProposal(proposalId, true);

  const { data: votes } = useReadContract({
    chainId: PUB_L2_CHAIN.id,
    address: PUB_TOKEN_L2_ADDRESS,
    abi: erc20VotesAbi,
    functionName: "getPastVotes",
    args: [address!, proposal?.parameters.snapshotTimestamp ?? 0n],
    query: {
      enabled: !!proposal && proposal?.parameters.snapshotTimestamp !== undefined,
    },
  });

  return { votes };
}
