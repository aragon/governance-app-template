import { Proposal, VotingMode } from "@/plugins/tokenVoting/utils/types";
import { Tally } from "./types";
import { compactNumber } from "@/utils/numbers";
import { formatEther } from "viem";
export const RATIO_BASE = 1_000_000;

export function getProposalStatusVariant(proposal: Proposal, tokenSupply: bigint) {
  // Terminal cases
  if (!proposal?.tally) return { variant: "info", label: "(Loading)" };
  else if (proposal.executed) return { variant: "primary", label: "Executed" };

  const supportThreshold = proposal.parameters.supportThreshold;

  if (!proposal.active) {
    // Defeated or executable?
    const yesNoVotes = proposal.tally.no + proposal.tally.yes;
    if (!yesNoVotes) return { variant: "critical", label: "Defeated" };

    const totalVotes = proposal.tally.abstain + yesNoVotes;
    if (totalVotes < proposal.parameters.minVotingPower) {
      return { variant: "critical", label: "Low turnout" };
    }

    const finalRatio = (BigInt(RATIO_BASE) * proposal.tally.yes) / yesNoVotes;

    if (finalRatio > BigInt(supportThreshold)) {
      return { variant: "success", label: "Executable" };
    }
    return { variant: "critical", label: "Defeated" };
  }

  // Active or early execution?
  const noVotesWorstCase = tokenSupply - proposal.tally.yes - proposal.tally.abstain;
  const totalYesNoWc = proposal.tally.yes + noVotesWorstCase;

  if (proposal.parameters.votingMode == VotingMode.EarlyExecution) {
    const currentRatio = (BigInt(RATIO_BASE) * proposal.tally.yes) / totalYesNoWc;
    if (currentRatio > BigInt(supportThreshold)) {
      return { variant: "success", label: "Executable" };
    }
  }
  return { variant: "info", label: "Active" };
}

export function getWinningOption(tally: Tally | undefined): {
  option: string;
  voteAmount: string;
  votePercentage: number;
} {
  if (!tally) return { option: "Yes", voteAmount: "0", votePercentage: 0 };
  const totalVotes = tally.yes + tally.no + tally.abstain;

  if (totalVotes === BigInt(0)) return { option: "Yes", voteAmount: "0", votePercentage: 0 };
  const winningOption = tally.yes >= tally.no ? (tally.yes >= tally.abstain ? "Yes" : "Abstain") : "No";
  const winningVotes = tally.yes >= tally.no ? (tally.yes >= tally.abstain ? tally.yes : tally.abstain) : tally.no;

  return {
    option: winningOption,
    voteAmount: compactNumber(formatEther(winningVotes), 2),
    votePercentage: Number((winningVotes * 100n) / totalVotes),
  };
}
