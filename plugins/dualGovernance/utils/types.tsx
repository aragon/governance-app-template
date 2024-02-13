import { Address } from "viem";
import { Action } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type ProposalParameters = {
  startDate: bigint;
  endDate: bigint;
  snapshotBlock: bigint;
  minVetoVotingPower: bigint;
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
  args: VetoCastEvent[];
};

export type VetoCastEvent = {
  voter: Address;
  proposalId: bigint;
  votingPower: bigint;
};
