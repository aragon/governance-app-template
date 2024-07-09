import { Address, Hex } from "viem";
import { IVotesDataListVariant } from "@/components/proposalVoting/votesDataList/votesDataListItemStructure";
import { IApprovalThresholdResult, IButtonProps, ProposalType } from "@aragon/ods";

export type Action = {
  to: Address;
  value: bigint;
  data: Hex;
};

export type RawAction = {
  to: Address;
  value: bigint;
  data: Hex;
};

export interface IAlert {
  id: number;
  type: "success" | "info" | "error";
  message: string;
  description?: string;
  explorerLink?: string;
  dismissTimeout?: ReturnType<typeof setTimeout>;
}

export enum ProposalStages {
  DRAFT = "Draft",
  MULTISIG_APPROVAL = "Multisig Approval",
  OPTIMISTIC_EXECUTION = "Optimistic Execution",
  MAJORITY_VOTING = "Majority Voting",
}

export type IProposalResource = {
  name: string;
  url: string;
};

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
  censusBlock: number;
  startDate: string;
  endDate: string;
  strategy: string;
  options: string;
}

export interface IVote {
  address: Address;
  variant: IVotesDataListVariant;
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

// General types

type JsonLiteral = string | number | boolean;
export type JsonValue = JsonLiteral | Record<string, JsonLiteral> | Array<JsonLiteral>;
