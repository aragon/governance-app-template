import { compactNumber } from "@/utils/numbers";
import { ITransformedStage, IVote, ProposalStages } from "@/utils/types";
import dayjs from "dayjs";
import { formatEther } from "viem";
import { useVotingToken } from "./useVotingToken";
import { useProposalVoting } from "./useProposalVoting";
import { useProposalStatus } from "./useProposalVariantStatus";
import { useProposalExecute } from "./useProposalExecute";

export function useL1ProposalStage(proposalId: string): ITransformedStage {
  const { symbol } = useVotingToken();
  const tokenSymbol = symbol ?? "Votes";
  const {
    proposal,
    canVote,
    votes,
    isConfirming: isConfirmingApproval,
    voteProposal,
    voteWPaymaster,
  } = useProposalVoting(proposalId);
  const proposalStatus = useProposalStatus(proposal!);
  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalId);

  const yes = proposal?.tally.yes ?? 0n;
  const no = proposal?.tally.no ?? 0n;
  const abstain = proposal?.tally.abstain ?? 0n;
  const denominator = yes + no + abstain > 0n ? yes + no + abstain : 1n;

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
      // @ts-expect-error ignoring for now
      cta: proposal?.executed
        ? {
            disabled: true,
            label: "Executed",
          }
        : canExecute
          ? {
              isLoading: isConfirmingExecution,
              label: "Execute",
              onClick: executeProposal,
            }
          : {
              disabled: !canVote,
              isLoading: isConfirmingApproval,
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
    voteWPaymaster,
  };
}
