import { Address, Hex } from "viem";
import { IProposalResource, RawAction } from "@/utils/types";

export type ProposalInputs = {
  proposalId: bigint;
};

export type EmergencyProposalResultType = readonly [
  executed: boolean,
  approvals: number,
  parameters: EmergencyProposalParameters,
  encryptedPayloadUri: Hex,
  publicMetadataUriHash: Hex,
  destActionsHash: Hex,
  destinationPlugin: Address,
];

export type EmergencyProposalParameters = {
  expirationDate: bigint;
  snapshotBlock: bigint;
  minApprovals: number;
};

export type EncryptedProposalMetadata = {
  encrypted: {
    metadata: string; // base64
    actions: string; // base64
    symmetricKeys: Hex[];
  };
};

export type EmergencyProposal = {
  // active: boolean;
  executed: boolean;
  parameters: EmergencyProposalParameters;
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
