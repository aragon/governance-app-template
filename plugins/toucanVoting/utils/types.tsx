import { Address } from "viem";
import { Action } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export enum VotingMode {
  Standard,
  EarlyExecution,
  VoteReplacement,
}

export type ProposalParameters = {
  votingMode: VotingMode;
  supportThreshold: number;
  startDate: bigint;
  endDate: bigint;
  snapshotBlock: bigint;
  minVotingPower: bigint;
};

export type Tally = {
  abstain: bigint;
  yes: bigint;
  no: bigint;
};

export type Proposal = {
  active: boolean;
  executed: boolean;
  parameters: ProposalParameters;
  tally: Tally;
  actions: Action[];
  allowFailureMap: bigint;
  creator: string;
  title: string;
  summary: string;
  resources: string[];
};

export type ProposalMetadata = {
  title: string;
  summary: string;
  resources: string[];
};

export type VoteCastResponse = {
  args: VoteCastEvent[];
};

export type VoteCastEvent = {
  voter: Address;
  proposalId: bigint;
  voteOption: number;
  votingPower: bigint;
};
