import { Address } from "viem";
import type { IProposalResource, RawAction } from "@/utils/types";

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
  actions: RawAction[];
  allowFailureMap: bigint;
  creator: string;
  title: string;
  summary: string;
  description: string;
  resources: IProposalResource[];
};

export type VoteCastResponse = {
  args: VetoCastEvent[];
};

export type VetoCastEvent = {
  voter: Address;
  proposalId: bigint;
  votingPower: bigint;
};
