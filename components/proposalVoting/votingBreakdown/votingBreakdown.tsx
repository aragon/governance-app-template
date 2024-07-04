import { BreakdownApprovalThresholdResult, type IBreakdownApprovalThresholdResult } from "./approvalThresholdResult";
import { BreakdownMajorityVotingResult, type IBreakdownMajorityVotingResult } from "./majorityVotingResult";
import { type VotingCta } from "./types";

export type ProposalType = "majorityVoting" | "approvalThreshold";

export interface IVotingBreakdownProps<TType extends ProposalType = ProposalType> {
  variant: TType;
  result?: TType extends "approvalThreshold" ? IBreakdownApprovalThresholdResult : IBreakdownMajorityVotingResult;
  cta?: VotingCta;
}

export const VotingBreakdown: React.FC<IVotingBreakdownProps> = (props) => {
  const { result, cta, variant } = props;

  return (
    <>
      {variant === "approvalThreshold" && !!result && (
        <BreakdownApprovalThresholdResult {...(result as IBreakdownApprovalThresholdResult)} cta={cta} />
      )}
      {variant === "majorityVoting" && !!result && (
        <BreakdownMajorityVotingResult {...(result as IBreakdownMajorityVotingResult)} cta={cta} />
      )}
    </>
  );
};
