import { Address } from "viem";
import { IProposalResource, RawAction } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type MultisigProposalResultType = readonly [
  boolean, // executed
  number, // approvals
  MultisigProposalParameters, // proposalParameters
  readonly RawAction[], // actions
  bigint, // allowFailureMap
];

export type MultisigProposalParameters = {
  minApprovals: number;
  snapshotBlock: bigint;
  startDate: bigint;
  endDate: bigint;
};

export type MultisigProposal = {
  executed: boolean;
  parameters: MultisigProposalParameters;
  approvals: number;
  actions: RawAction[];
  allowFailureMap: bigint;
  creator: string;
  title: string;
  summary: string;
  description: string;
  resources: IProposalResource[];
};

export type ApprovedEvent = {
  proposalId?: bigint;
  approver?: Address;
};
