import { Address } from 'viem'
import { Action } from '@/utils/types'

export type ProposalInputs = {
  proposalId: bigint;
}

export type ProposalCreatedLogResponse = {
  args: {
    actions: Action[];
    allowFailureMap: bigint;
    creator: string;
    endDate: bigint;
    startDate: bigint;
    metadata: string;
    proposalId: bigint;
  }
}

enum VotingMode {
  Standard,
  EarlyExecution,
  VoteReplacement
}

export type ProposalParameters = {
  votingMode: VotingMode;
  supportThreshold: number;
  startDate: bigint;
  endDate: bigint;
  snapshotBlock: bigint;
  minVotingPower: bigint;
}

export type Tally = {
  abstain: bigint;
  yes: bigint;
  no: bigint;
}

export type Proposal = {
  active: boolean;
  executed: boolean;
  parameters: ProposalParameters;
  tally: Tally;
  actions: Action[];
  allowFailureMap: bigint;
  title: string;
  summary: string;
  resources: string[];

}

export type GetProposalCallResponse = {
  data: Proposal;
  isLoading: boolean;
}

export type ProposalMetadata = {
  title: string;
  summary: string;
  resources: string[];
}

export type VoteCastResponse = {
  args: VoteCastEvent[];
}

export type VoteCastEvent = {
  voter: Address;
  proposalId: bigint;
  voteOption: number;
  votingPower: bigint;
}