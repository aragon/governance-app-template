import { AlertInline, Tag, Button } from "@aragon/ods";
import { Proposal, ProposalCreatedLogResponse } from "@/utils/types";
import dayjs from "dayjs";
import { AlertVariant } from "@aragon/ods/dist/types/src/components/alerts/utils";
import { TagVariant } from "@aragon/ods/dist/types/src/components/tag/tag";
import { Else, If, IfCase, Then } from "../if";
import { StatusTag } from "../text/status-tag";
import { AddressText } from "../text/address";

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  userVote: number | undefined;
  userCanVote: boolean;
  setShowVotingModal: Function;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  proposal,
  userVote,
  userCanVote,
  setShowVotingModal,
}) => {
  const { proposalVariant, proposalLabel, votedVariant, votedLabel } =
    digestStatus(userVote, proposal);
  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <span className="text-xl font-semibold text-neutral-700 pt-1">
            Proposal {proposalNumber + 1}
          </span>
        </div>
        <div className="flex">
          <IfCase condition={userCanVote}>
            <Then>
              <Button
                className="flex h-5 items-center"
                size="md"
                variant="primary"
                onClick={() => setShowVotingModal(true)}
              >
                Submit Vote
              </Button>
            </Then>
            <Else>
              <If condition={userVote}>
                <StatusTag
                  label={`Voted ${votedLabel}`}
                  variant={votedVariant}
                />
              </If>
            </Else>
          </IfCase>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by{" "}
        <AddressText>{(proposal as any as ProposalCreatedLogResponse)?.args?.creator}</AddressText>
        &nbsp;active until
        <span className="text-primary-400 font-semibold">
          {" "}
          {dayjs(Number(proposal.parameters?.endDate) * 1000).format(
            "DD/MM/YYYY hh:mm"
          )}
          h
        </span>
      </p>
      <p className="pt-2">
        <AlertInline
          variant={proposalVariant}
          message={"The proposal is " + proposalLabel}
        />
      </p>
    </div>
  );
};

function digestStatus(userVote: number | undefined, proposal: Proposal) {
  let proposalVariant: AlertVariant;
  let proposalLabel: string;
  if (proposal?.open) {
    proposalVariant = "info";
    proposalLabel = "open";
  } else if (proposal?.executed) {
    proposalVariant = "success";
    proposalLabel = "executed";
  } else if (proposal?.tally?.no >= proposal?.tally?.yes) {
    proposalVariant = "critical";
    proposalLabel = "defeated";
  } else {
    proposalVariant = "success";
    proposalLabel = "executable";
  }

  let votedVariant: TagVariant;
  let votedLabel: string;
  switch (userVote) {
    case 1:
      votedVariant = "neutral";
      votedLabel = "abstain";
      break;
    case 2:
      votedVariant = "success";
      votedLabel = "yes";
      break;
    case 3:
      votedVariant = "critical";
      votedLabel = "no";
      break;
    default:
      votedVariant = "neutral";
      votedLabel = "other";
      break;
  }
  return {
    proposalVariant,
    proposalLabel,
    votedVariant,
    votedLabel,
  };
}

export default ProposalHeader;
