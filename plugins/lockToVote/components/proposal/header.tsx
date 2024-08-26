import { AvatarIcon, Breadcrumbs, Button, Heading, IBreadcrumbsLink, IconType, ProposalStatus, Tag } from "@aragon/ods";
import { Publisher } from "@/components/publisher";
import { Proposal } from "../../utils/types";
import { useProposalStatus } from "../../hooks/useProposalVariantStatus";
import { Else, ElseIf, If, Then } from "@/components/if";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { useProposalClaimLock } from "../../hooks/useProposalClaimLock";
import { HeaderSection } from "@/components/layout/header-section";
import { getTagVariantFromStatus } from "@/utils/ui-variants";
import { capitalizeFirstLetter } from "@/utils/text";
import dayjs from "dayjs";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_SUMMARY = "(No proposal summary)";

interface ProposalHeaderProps {
  proposalIdx: number;
  proposal: Proposal;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposalIdx, proposal }) => {
  const proposalStatus = useProposalStatus(proposal);
  const tagVariant = getTagVariantFromStatus(proposalStatus);
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { claimLockProposal, isConfirming: isConfirmingClaimLock, hasClaimed } = useProposalClaimLock(proposalIdx);

  const breadcrumbs: IBreadcrumbsLink[] = [{ label: "Proposals", href: "#/" }, { label: proposalIdx.toString() }];
  const isEmergency = proposal.parameters.startDate === 0n;
  const endDateIsInThePast = Number(proposal.parameters.endDate) * 1000 < Date.now();

  return (
    <div className="flex w-full justify-center bg-neutral-0">
      {/* Wrapper */}
      <HeaderSection>
        <Breadcrumbs
          links={breadcrumbs}
          tag={
            proposalStatus && {
              label: capitalizeFirstLetter(proposalStatus),
              variant: tagVariant,
            }
          }
        />
        {/* Title & description */}
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center gap-x-4">
            <Heading size="h1">{proposal.title || DEFAULT_PROPOSAL_TITLE}</Heading>
            {isEmergency && <Tag label="Emergency" variant="critical" />}
          </div>
          <p className="text-lg leading-normal text-neutral-500">{proposal.summary || DEFAULT_PROPOSAL_SUMMARY}</p>
        </div>
        {/* Metadata */}
        <div className="flex flex-wrap gap-x-10 gap-y-2">
          <div className="flex items-center gap-x-2">
            <AvatarIcon icon={IconType.APP_MEMBERS} size="sm" variant="primary" />
            <Publisher publisher={[{ address: proposal.creator }]} />
          </div>
          <div className="flex items-center gap-x-2">
            <AvatarIcon icon={IconType.APP_MEMBERS} size="sm" variant="primary" />
            <div className="flex gap-x-1 text-base leading-tight ">
              <If val={proposalStatus} is={ProposalStatus.VETOED}>
                <Then>
                  <span className="text-neutral-500">The proposal has been defeated</span>
                </Then>
                <ElseIf true={endDateIsInThePast}>
                  <span className="text-neutral-500">The veto period is over</span>
                </ElseIf>
                <Else>
                  <span className="text-neutral-500">Active for </span>
                  <span className="text-neutral-800">
                    {getSimpleRelativeTimeFromDate(dayjs(Number(proposal.parameters.endDate) * 1000))}
                  </span>
                </Else>
              </If>
            </div>
          </div>
        </div>

        <div>
          <span className="flex w-full flex-col gap-x-4 gap-y-3 md:flex-row">
            <If not={isConnected}>
              <Then>
                <Button onClick={() => open()}>Connect your wallet</Button>
              </Then>
              <ElseIf not={hasClaimed}>
                <Button isLoading={isConfirmingClaimLock} onClick={claimLockProposal}>
                  Reclaim voting power
                </Button>
              </ElseIf>
            </If>
          </span>
        </div>
      </HeaderSection>
    </div>
  );
};

export default ProposalHeader;
