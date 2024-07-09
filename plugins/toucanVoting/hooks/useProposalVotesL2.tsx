import { useReadContract } from "wagmi";
import { useProposalRef } from "./useProposalRef";
import { PUB_L2_CHAIN, PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS } from "@/constants";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { useProposal } from "./useProposal";

export function useGetProposalVotesL2(proposalId: number) {
  const { proposalRef } = useProposalRef(proposalId);

  const {
    data: l2Votes,
    isLoading,
    isError,
    queryKey: proposalL2QueryKey,
  } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    chainId: PUB_L2_CHAIN.id,
    functionName: "proposals",
    args: [BigInt(proposalRef ?? 0)],
    query: { enabled: !!proposalRef },
  });

  return {
    l2Votes,
    isLoading,
    isError,
    proposalL2QueryKey,
  };
}

export function useGetPendingVotesOnL2(proposalId: number) {
  // get the L1 votes
  const { proposal, status, proposalQueryKey } = useProposal(proposalId.toString());

  // get the L2 votes
  const { l2Votes, isLoading: isL2Loading, isError: isL2Error, proposalL2QueryKey } = useGetProposalVotesL2(proposalId);

  // base pending
  let pending = {
    yes: 0n,
    no: 0n,
    abstain: 0n,
  };

  // check if we have an error
  const isError = status.proposalError || isL2Error;
  const isLoading = status.proposalLoading || isL2Loading;

  // if so or we don't have the data yet, return
  if (!proposal || isError || isLoading || !l2Votes) {
    return {
      hasPending: false,
      pending,
      isLoading,
      isError,
    };
  }

  // check the l2 vs the l1 tally
  const l1Tally = proposal?.tally;

  pending = {
    yes: l2Votes.yes - l1Tally?.yes,
    no: l2Votes.no - l1Tally?.no,
    abstain: l2Votes.abstain - l1Tally?.abstain,
  };

  return {
    queries: [proposalQueryKey, proposalL2QueryKey],
    hasPending: pending.yes !== 0n || pending.no !== 0n || pending.abstain !== 0n,
    pending,
    isLoading,
    isError,
  };
}
