import { compactNumber } from "@/utils/numbers";
import { ITransformedStage, IVote, ProposalStages } from "@/utils/types";
import dayjs from "dayjs";
import { formatEther } from "viem";
import { useVotingToken } from "./useVotingToken";
import { useProposalVoting } from "./useProposalVoting";
import { useProposalStatus } from "./useProposalVariantStatus";
import { useGetProposalVotesL2 } from "./usePendingVotesRelay";
import { useRelayVotesList } from "./useProposalVoteList";
import { removeDuplicates } from "../utils/array";
import { useMemo } from "react";
import { useCanVoteL2 } from "./useUserCanVote";

export function useL2ProposalStage(proposalId: string): ITransformedStage {
  const { symbol } = useVotingToken();
  const tokenSymbol = symbol ?? "Votes";
  const { proposal, voteProposal } = useProposalVoting(proposalId);
  const proposalStatus = useProposalStatus(proposal!);
  const { l2Votes, isLoading } = useGetProposalVotesL2(Number(proposalId));
  const canVote = useCanVoteL2(proposalId);

  const yes = l2Votes?.yes ?? 0n;
  const no = l2Votes?.no ?? 0n;
  const abstain = l2Votes?.abstain ?? 0n;
  const denominator = yes + no + abstain > 0n ? yes + no + abstain : 1n;

  const votes = useRelayVotesList(proposalId, proposal);

  // performance wise, this is O(n^2) and should be optimized
  // so we disable it as the number of votes grows super large
  // and we memoize the result to be safe
  const filteredVotes = useMemo(() => {
    if (votes.length <= 1000) return removeDuplicates(votes, "voter");
    else return votes;
  }, [votes]);

  // todo this can be simplified a lot
  return {
    id: "1",
    type: ProposalStages.MAJORITY_VOTING,
    variant: "majorityVoting",
    title: "",
    status: proposalStatus!,
    disabled: false,
    proposalId,
    providerId: "1",
    result: {
      cta: {
        disabled: !canVote,
        isLoading,
        label: "Vote",
        //@ts-expect-error ignoring for now
        onClick: voteProposal,
      },
      votingScores: [
        {
          option: "Yes",
          voteAmount: compactNumber(formatEther(yes), 2),
          votePercentage: Number((yes * 100n) / denominator),
          tokenSymbol,
        },
        {
          option: "No",
          voteAmount: compactNumber(formatEther(no), 2),
          votePercentage: Number((no * 100n) / denominator),
          tokenSymbol,
        },
        {
          option: "Abstain",
          voteAmount: compactNumber(formatEther(abstain), 2),
          votePercentage: Number((abstain * 100n) / denominator),
          tokenSymbol,
        },
      ],
    },
    details: {
      censusBlock: Number(proposal?.parameters.snapshotBlock),
      startDate: dayjs(Number(proposal?.parameters.startDate) * 1000).toString(),
      endDate: dayjs(Number(proposal?.parameters.endDate) * 1000).toString(),
      strategy: "Crosschain Majority Voting",
      options: "Yes, No, Abstain",
    },
    votes: filteredVotes && filteredVotes.map(({ voter: address }) => ({ address, variant: "approve" }) as IVote),
  };
}
