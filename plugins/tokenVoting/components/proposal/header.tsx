import { AlertInline, Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/tokenVoting/utils/types";
import { AlertVariant } from "@aragon/ods";
import { getProposalStatusVariant } from "@/plugins/tokenVoting/utils/proposal-status";
import { Else, ElseIf, If, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";
import dayjs from "dayjs";

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
