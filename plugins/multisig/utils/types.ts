import { Address } from "viem";
import { IProposalResource, RawAction } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type MultisigProposalResultType = readonly [
  boolean,
  number,
  MultisigProposalParameters,
  string,
  readonly RawAction[],
  Address,
];

export type MultisigProposalParameters = {
  expirationDate: bigint;
  snapshotBlock: bigint;
  minApprovals: number;
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

export type ApprovedEventResponse = {
  args: ApprovedEvent[];
};

export type ApprovedEvent = {
  proposalId: bigint;
  approver: Address;
};
