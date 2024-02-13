import { Address } from "viem";
import { Action } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type ProposalParameters = {
  startDate: bigint;
  endDate: bigint;
  snapshotBlock: bigint;
  minVetoPower: bigint;
};

export type Proposal = {
  active: boolean;
  executed: boolean;
  parameters: ProposalParameters;
  vetoTally: bigint;
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
