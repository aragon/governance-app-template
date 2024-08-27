import { IApprovalThresholdResult, IButtonProps, ProposalType } from "@aragon/ods";
import { Address, Hex, AbiFunction } from "viem";
import { IVotesDataListVariant } from "@/components/proposalVoting/votesDataList/votesDataListItemStructure";

// General types
type JsonLiteral = string | number | boolean;
export type JsonValue = JsonLiteral | { [k: string]: JsonValue } | JsonValue[];
export type EvmValue = string | Hex | Address | number | bigint | boolean;

export type RawAction = {
  to: Address;
  value: bigint;
  data: Hex;
};

/** Includes the raw action plus the decoded ABI and parameters of the function call */
export type DecodedAction = RawAction & {
  functionName: string | null;
  functionAbi: AbiFunction | null;
  args: EvmValue[];
};

export interface IAlert {
  id: number;
  type: "success" | "info" | "error";
  message: string;
  description?: string;
  explorerLink?: string;
  dismissTimeout?: ReturnType<typeof setTimeout>;
}

export type ProposalMetadata = {
  title: string;
  summary: string;
  description: string;
  resources: IProposalResource[];
};

export type IProposalResource = {
  name: string;
  url: string;
};

export enum ProposalStages {
  DRAFT = "Draft",
  MULTISIG_APPROVAL = "Multisig Approval",
  OPTIMISTIC_EXECUTION = "Optimistic Execution",
  TOKEN_VOTING = "Token voting",
}

export type VotingCta = Pick<IButtonProps, "disabled" | "isLoading"> & {
  label?: string;
  onClick?: (value?: number) => void;
};

export interface IBreakdownApprovalThresholdResult extends IApprovalThresholdResult {
  cta?: VotingCta;
}

export interface IBreakdownMajorityVotingResult {
  votingScores: { option: string; voteAmount: string; votePercentage: number; tokenSymbol: string }[];
  cta?: VotingCta;
  proposalId: string;
}

export interface IVotingStageDetails {
  censusBlock?: number;
  censusTimestamp?: number;
  startDate: string;
  endDate: string;
  tokenAddress?: Address;
  strategy: string;
  options: string;
}

export interface IVote {
  address: Address;
  variant: IVotesDataListVariant;
}

export interface IResource {
  name: string;
  link: string;
}

export interface ITransformedStage<TType extends ProposalType = ProposalType> {
  id: string;
  type: ProposalStages;
  variant: TType;
  title: string;
  status: string;
  disabled: boolean;
  votes: IVote[];
  proposalId?: string;
  providerId?: string;
  result?: TType extends "approvalThreshold" ? IBreakdownApprovalThresholdResult : IBreakdownMajorityVotingResult;
  details?: IVotingStageDetails;
}
