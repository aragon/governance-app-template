import { compactNumber } from "@/utils/numbers";
import { ITransformedStage, IVote, ProposalStages } from "@/utils/types";
import dayjs from "dayjs";
import { formatEther } from "viem";
import { useVotingToken } from "./useVotingToken";
import { useProposalVoting } from "./useProposalVoting";
import { useProposalStatus } from "./useProposalVariantStatus";
import { useGetProposalVotesL2 } from "./useProposalVotesL2";

export function useL2ProposalStage(proposalId: string): ITransformedStage {
  const { symbol } = useVotingToken();
  const tokenSymbol = symbol ?? "Votes";
  const { proposal } = useProposalVoting(proposalId);
  const proposalStatus = useProposalStatus(proposal!);
  const { l2Votes, isLoading } = useGetProposalVotesL2(Number(proposalId));

  const yes = l2Votes?.yes ?? 0n;
  const no = l2Votes?.no ?? 0n;
  const abstain = l2Votes?.abstain ?? 0n;
  const denominator = yes + no + abstain > 0n ? yes + no + abstain : 1n;

  const votes = [] as any[];

  const canVote = true;

  const voteProposal = () => {};

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
    votes: votes && votes.map(({ voter: address }) => ({ address, variant: "approve" }) as IVote),
  };
}
