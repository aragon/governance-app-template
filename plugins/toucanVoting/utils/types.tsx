import { Address } from "viem";
import { Action } from "@/utils/types";
import { MessagingReceipt } from "./layer-zero";

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
  snapshotTimestamp: bigint;
  minVotingPower: bigint;
};

export type Tally = {
  abstain: bigint;
  yes: bigint;
  no: bigint;
};

export type MetadataResource = {
  name: string;
  url: string;
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
  description: string;
  resources: MetadataResource[];
};

export type ProposalMetadata = {
  title: string;
  summary: string;
  resources: MetadataResource[];
  description: string;
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

//  event VoteCast(
//   uint32 indexed dstEid,
//   uint256 indexed proposalRef,
//   address indexed voter,
//   Tally voteOptions
// );
export type VoteCastRelayEvent = {
  dstEid: number;
  proposalRef: bigint;
  voter: Address;
  voteOptions: Tally;
};

export type VoteCastRelayResponse = {
  args: VoteCastRelayEvent[];
};

// event VotesDispatched(
//   uint32 indexed dstEid,
//   uint256 indexed proposalRef,
//   Tally votes,
//   MessagingReceipt receipt
// );
export type VotesDispatchedEvent = {
  dstEid: number;
  proposalRef: bigint;
  votes: Tally;
  receipt: MessagingReceipt;
};

export type VotesDispatchedResponse = {
  args: VotesDispatchedEvent[];
};

///  event VotesReceived(uint256 proposalId,uint256 votingChainId,address plugin,IVoteContainer.Tally votes);
export type VotesReceivedEvent = {
  proposalId: bigint;
  votingChainId: bigint;
  plugin: Address;
  votes: Tally;
};

export type VotesReceivedResponse = {
  args: VotesReceivedEvent[];
};
