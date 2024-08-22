import { AvatarIcon, Breadcrumbs, Heading, IBreadcrumbsLink, IconType, ProposalStatus, TagVariant } from "@aragon/ods";
import { MultisigProposal } from "@/plugins/multisig/utils/types";
import { useProposalStatus } from "@/plugins/multisig/hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { HeaderSection } from "@/components/layout/header-section";
import { Publisher } from "@/components/publisher";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { Else, ElseIf, If, Then } from "@/components/if";
import { getTagVariantFromStatus } from "@/utils/ui-variants";
import { capitalizeFirstLetter } from "@/utils/text";

interface ProposalHeaderProps {
  proposalId: string;
  proposal: MultisigProposal;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposalId, proposal }) => {
  const proposalStatus = useProposalStatus(proposal);
  const tagVariant = getTagVariantFromStatus(proposalStatus);
  const breadcrumbs: IBreadcrumbsLink[] = [{ label: "Proposals", href: "#/" }, { label: proposalId.toString() }];
  const expired = Number(proposal.parameters.expirationDate) * 1000 <= Date.now();

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
            <Heading size="h1">{proposal.title}</Heading>
            {/* && <Tag label="Emergency" variant="critical" />*/}
          </div>
          <p className="text-lg leading-normal text-neutral-500">{proposal.summary}</p>
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
              <If val={proposalStatus} is={ProposalStatus.EXECUTED}>
                <Then>
                  <span className="text-neutral-500">The proposal was sent to the community stage</span>
                </Then>
                <ElseIf true={expired}>
                  <span className="text-neutral-500">The proposal expired</span>
                </ElseIf>
                <Else>
                  <span className="text-neutral-800">
                    {getSimpleRelativeTimeFromDate(dayjs(Number(proposal.parameters.expirationDate) * 1000))}
                  </span>
                  <span className="text-neutral-500">left until expiration</span>
                </Else>
              </If>
            </div>
          </div>
        </div>
      </HeaderSection>
    </div>
  );
};

export default ProposalHeader;
