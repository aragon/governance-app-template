import { useState, useEffect } from "react";
import { AlertInline, Button, Tag } from '@aragon/ods'
import { Proposal, ProposalCreatedLogResponse } from '@/utils/types'
import { formatAddress } from '@/utils/addressHelper';
import dayjs from "dayjs";
import { AlertVariant } from '@aragon/ods/dist/types/src/components/alerts/utils';
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

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposalNumber, proposal, userVote, userCanVote, setShowVotingModal }) => {
  const [proposalVariant, setProposalVariant] = useState({variant: '', label: ''});
  const [userVoteData, setUserVoteData] = useState({variant: '', label: ''});

  useEffect(() => {
    setProposalVariant(getProposalVariantStatus(proposal));
  }, [proposal]);
  
  useEffect(() => {
    setUserVoteData(getUserVoteData());
  }, [userVote]);

  const getProposalVariantStatus = (proposal: Proposal) => {
    return {
      variant: proposal?.open ? 'info' : proposal?.executed ? 'success' : proposal?.tally?.no >= proposal?.tally?.yes ? 'critical' : 'success' as AlertVariant,
      label: proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'Executable',
    }
  }

  const getUserVoteData = () => {
    if (userVote === 3) {
      return { variant: 'critical' as AlertVariant, label: 'Against' }
    } else if (userVote === 1) {
      return { variant: 'info' as AlertVariant, label: 'Abstain' }
    } else {
      return { variant: 'success' as AlertVariant, label: 'For' }
    }
  }

  if (userVoteData.variant === '') return <></>;

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200 
             * text-info-800 text-success-800 text-critical-800
            */}
            {proposal.tally && (
              <div className="flex">
              <Tag
                className="text-center text-critical-800"
                label={proposalVariant.label}
                variant={proposalVariant.variant as AlertVariant}
              />
              </div>
            )}
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
              onClick={() => setShowVotingModal(true)}
            >Vote</Button>
            </Then>
            <Else>
              <If condition={userVote}>
              <div className="flex items-center align-center">
                <span className="text-md text-neutral-800 font-semibold pr-4">Voted: </span>
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
    </div>
  );
};

export default ProposalHeader;
