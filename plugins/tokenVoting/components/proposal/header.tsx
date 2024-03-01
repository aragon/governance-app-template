import { AlertInline, Button, Tag } from "@aragon/ods";
import { Proposal, VotingMode } from "@/plugins/tokenVoting/utils/types";
import { AlertVariant } from "@aragon/ods";
import { Else, ElseIf, If, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";
import dayjs from "dayjs";

const RATIO_BASE = 1_000_000;
const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  tokenSupply: bigint;
  userVote: number | undefined;
  canVote: boolean;
  canExecute: boolean;
  transactionConfirming: boolean;
  onShowVotingModal: () => void;
  onExecute: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  proposal,
  tokenSupply,
  userVote,
  canVote,
  canExecute,
  transactionConfirming,
  onShowVotingModal,
  onExecute,
}) => {
  const userVoteInfo = getUserVoteVariant(userVote);
  const proposalVariant = getProposalStatusVariant(proposal, tokenSupply);
  const ended = proposal.parameters.endDate <= Date.now() / 1000;

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200
             * text-info-800 text-success-800 text-critical-800
             */}
            <If condition={proposal.tally && proposalVariant.variant}>
              <div className="flex">
                {proposalVariant?.variant && (
                  <Tag
                    className="text-center text-critical-800"
                    label={proposalVariant.label}
                    variant={proposalVariant.variant as AlertVariant}
                  />
                )}
              </div>
            </If>
            <span className="text-xl font-semibold text-neutral-700 pt-1">
              Proposal {proposalNumber}
            </span>
          </div>
        </div>
        <div className="flex">
          <If condition={transactionConfirming}>
            <Then>
              <div>
                <PleaseWaitSpinner fullMessage="Confirming..." />
              </div>
            </Then>
            <ElseIf condition={canVote}>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="primary"
                onClick={() => onShowVotingModal()}
              >
                Submit vote
              </Button>
            </ElseIf>
            <ElseIf condition={canExecute}>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="success"
                onClick={() => onExecute()}
              >
                Execute
              </Button>
            </ElseIf>
            <ElseIf condition={userVote && userVoteInfo.label}>
              <div className="flex items-center align-center">
                {userVoteInfo?.variant && (
                  <AlertInline
                    className="flex h-5 items-center"
                    variant={(userVoteInfo.variant as AlertVariant) ?? "info"}
                    message={userVoteInfo.label ?? " "}
                  />
                )}
              </div>
            </ElseIf>
          </If>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title || DEFAULT_PROPOSAL_TITLE}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by <AddressText>{proposal?.creator}</AddressText>,{" "}
        <If condition={ended}>
          <Then>
            ended on{" "}
            {dayjs(Number(proposal.parameters.endDate) * 1000).format(
              "D MMM YYYY HH:mm"
            )}
            h
          </Then>
          <Else>
            ending on{" "}
            {dayjs(Number(proposal.parameters.endDate) * 1000).format(
              "D MMM YYYY HH:mm"
            )}
            h
          </Else>
        </If>
      </p>
    </div>
  );
};

const getProposalStatusVariant = (proposal: Proposal, tokenSupply: bigint) => {
  // Terminal cases
  if (!proposal?.tally) return { variant: "info", label: "" };
  else if (proposal.executed) return { variant: "primary", label: "Executed" };

  const yesNoVotes = proposal.tally.no + proposal.tally.yes;
  if (!yesNoVotes) return { variant: "info", label: "" };

  const totalVotes = proposal.tally.abstain + yesNoVotes;
  const supportThreshold = proposal.parameters.supportThreshold;

  if (!proposal.active) {
    // Defeated or executable?
    if (totalVotes < proposal.parameters.minVotingPower) {
      return { variant: "critical", label: "Low turnout" };
    }

    const totalYesNo = proposal.tally.yes + proposal.tally.no;
    const finalRatio = (BigInt(RATIO_BASE) * proposal.tally.yes) / totalYesNo;

    if (finalRatio > BigInt(supportThreshold)) {
      return { variant: "success", label: "Executable" };
    }
    return { variant: "critical", label: "Defeated" };
  }

  // Active or early execution?
  const noVotesWorstCase =
    tokenSupply - proposal.tally.yes - proposal.tally.abstain;
  const totalYesNoWc = proposal.tally.yes + noVotesWorstCase;

  if (proposal.parameters.votingMode == VotingMode.EarlyExecution) {
    const currentRatio =
      (BigInt(RATIO_BASE) * proposal.tally.yes) / totalYesNoWc;
    if (currentRatio > BigInt(supportThreshold)) {
      return { variant: "success", label: "Executable" };
    }
  }
  return { variant: "info", label: "Active" };
};

const getUserVoteVariant = (userVote?: number) => {
  switch (userVote) {
    case 3:
      return { variant: "critical" as AlertVariant, label: "You voted no" };
    case 2:
      return { variant: "success" as AlertVariant, label: "You voted yes" };
    case 1:
      return { variant: "info" as AlertVariant, label: "You abstained" };
    default:
      return { variant: "", label: "" };
  }
};

export default ProposalHeader;
