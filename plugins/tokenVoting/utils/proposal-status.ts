import { Proposal, VotingMode } from "./types";
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
