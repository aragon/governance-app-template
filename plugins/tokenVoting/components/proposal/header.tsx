import { AlertInline, Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/tokenVoting/utils/types";
import { AlertVariant } from "@aragon/ods";
import { Else, ElseIf, If, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";

const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
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
  userVote,
  canVote,
  canExecute,
  transactionConfirming,
  onShowVotingModal,
  onExecute,
}) => {
  const userVoteInfo = getUserVoteVariant(userVote);
  const proposalVariant = getProposalStatusVariant(proposal);

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200
             * text-info-800 text-success-800 text-critical-800
             */}
            <If condition={proposal.tally}>
              <div className="flex">
                <Tag
                  className="text-center text-critical-800"
                  label={proposalVariant.label}
                  variant={proposalVariant.variant as AlertVariant}
                />
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
                Vote
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
                <span className="text-md text-neutral-800 font-semibold pr-4">
                  Voted:{" "}
                </span>
                <AlertInline
                  className="flex h-5 items-center"
                  variant={(userVoteInfo?.variant as AlertVariant) ?? ""}
                  message={userVoteInfo?.label ?? ""}
                />
              </div>
            </ElseIf>
          </If>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title || DEFAULT_PROPOSAL_TITLE}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by <AddressText>{proposal?.creator}</AddressText>
      </p>
    </div>
  );
};

const getProposalStatusVariant = (proposal: Proposal) => {
  return {
    variant: proposal?.active
      ? "info"
      : proposal?.executed
      ? "success"
      : proposal?.tally?.no >= proposal?.tally?.yes
      ? "critical"
      : ("success" as AlertVariant),
    label: proposal?.active
      ? "Active"
      : proposal?.executed
      ? "Executed"
      : proposal?.tally?.no >= proposal?.tally?.yes
      ? "Defeated"
      : "Executable",
  };
};

const getUserVoteVariant = (userVote?: number) => {
  switch (userVote) {
    case 3:
      return { variant: "critical" as AlertVariant, label: "Against" };
    case 2:
      return { variant: "success" as AlertVariant, label: "For" };
    case 1:
      return { variant: "info" as AlertVariant, label: "Abstain" };
    default:
      return { variant: "", label: "" };
  }
};

export default ProposalHeader;
