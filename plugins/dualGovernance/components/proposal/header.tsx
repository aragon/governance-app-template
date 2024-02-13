import { useState, useEffect } from "react";
import { AlertInline, Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { IAlertCardProps } from "@aragon/ods";
import { Else, If, IfCase, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";

const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  userVote: number | undefined;
  userCanVote: boolean;
  onShowVotingModal: Function;
}
type AlertVariant = IAlertCardProps["variant"];

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  proposal,
  userVote,
  userCanVote,
  onShowVotingModal,
}) => {
  const [proposalVariant, setProposalVariant] = useState({
    variant: "",
    label: "",
  });
  const [userVoteData, setUserVoteData] = useState({ variant: "", label: "" });

  useEffect(() => {
    setProposalVariant(getProposalVariantStatus(proposal));
  }, [proposal]);

  useEffect(() => {
    setUserVoteData(getUserVoteData());
  }, [userVote]);

  const getProposalVariantStatus = (proposal: Proposal) => {
    return {
      variant: proposal?.active
        ? "info"
        : proposal?.executed
        ? "success"
        : proposal?.vetoTally >= proposal?.parameters.minVetoVotingPower
        ? "critical"
        : ("success" as AlertVariant),
      label: proposal?.active
        ? "Active"
        : proposal?.executed
        ? "Executed"
        : proposal?.vetoTally >= proposal?.parameters.minVetoVotingPower
        ? "Defeated"
        : "Executable",
    };
  };

  const getUserVoteData = () => {
    if (userVote === 3) {
      return { variant: "critical" as AlertVariant, label: "Against" };
    } else if (userVote === 1) {
      return { variant: "info" as AlertVariant, label: "Abstain" };
    } else {
      return { variant: "success" as AlertVariant, label: "For" };
    }
  };

  if (userVoteData.variant === "") return <></>;

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
              Proposal {proposalNumber + 1}
            </span>
          </div>
        </div>
        <div className="flex ">
          <IfCase condition={userCanVote}>
            <Then>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="primary"
                onClick={() => onShowVotingModal()}
              >
                Vote
              </Button>
            </Then>
            <Else>
              <If condition={userVote}>
                <div className="flex items-center align-center">
                  <span className="text-md text-neutral-800 font-semibold pr-4">
                    Voted:{" "}
                  </span>
                  <AlertInline
                    className="flex h-5 items-center"
                    variant={userVoteData.variant as AlertVariant}
                    message={userVoteData.label}
                  />
                </div>
              </If>
            </Else>
          </IfCase>
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

export default ProposalHeader;
