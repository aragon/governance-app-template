import { AlertInline, Button } from '@aragon/ods'
import { Proposal } from '@/utils/types'
import { formatAddress } from '@/utils/addressHelper';
import * as dayjs from 'dayjs'

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  userVote: number | undefined;
  userCanVote: boolean;
  setShowVotingModal: Function
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposalNumber, proposal, userVote, userCanVote, setShowVotingModal }) => {
  const getProposalVariantStatus = (proposal: Proposal) => {
    return {
      variant: proposal?.open ? 'info' : proposal?.executed ? 'success' : proposal?.tally?.no >= proposal?.tally?.yes ? 'critical' : 'success',
      label: proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute',
    }
  }

  const getUserVoteData = () => {
    if (userVote === 3) {
      return { variant: 'critical', label: 'Against' }
    } else if (userVote === 1) {
      return { variant: 'tertiary', label: 'Abstain' }
    } else {
      return { variant: 'success', label: 'For' }
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow">
          <span className="text-xl font-semibold text-neutral-700 pt-1">
            Proposal {proposalNumber + 1}
          </span>
          <div className="pl-5">
            {/** bg-info-400 bg-success-400 bg-critical-400 */}
            {proposal.tally && (
              <AlertInline
                className={`border border-${getProposalVariantStatus((proposal as Proposal)).variant}-400 py-2 px-4 rounded-xl`}
                message={getProposalVariantStatus((proposal as Proposal)).label}
                variant={getProposalVariantStatus((proposal as Proposal)).variant}
              />
            )}
          </div>
        </div>
        <div className="flex ">
          {userCanVote ?
            <Button
              className="flex h-5 items-center"
              size="lg"
              variant="primary"
              onClick={() => setShowVotingModal(true)}
            >Vote</Button>
            : userVote && (
              <div className="flex items-center align-center">
                <span className="text-lg text-neutral-800 font-semibold pr-4">Voted: </span>
                <Button
                  className="flex h-5 items-center"
                  size="lg"
                  variant={getUserVoteData().variant}
                >{getUserVoteData().label}</Button>
              </div>
            )}
        </div>
      </div>
      <h4 className="mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by
        <span className="text-primary-400 font-semibold underline"> {formatAddress(proposal.args?.creator)} </span>
        until
        <span className="text-primary-400 font-semibold"> {dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
      </p>
    </div>
  )
}

export default ProposalHeader;
