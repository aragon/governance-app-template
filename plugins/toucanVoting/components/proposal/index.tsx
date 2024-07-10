import { useProposalVoting } from "@/plugins/toucanVoting/hooks/useProposalVoting";
import { useRouter } from "next/router";
import { Card } from "@aragon/ods";
import { ProposalDataListItem } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalStatus } from "../../hooks/useProposalVariantStatus";
import { useAccount } from "wagmi";
import { Tally } from "../../utils/types";
import { getWinningOption } from "../../utils/proposal-status";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY = "(The metadata of the proposal is not available)";

type ProposalInputs = {
  proposalId: bigint;
};

/**
 * Recereate Next Link behaviour without the <a> tag, used for nesting the proposals in the ODS data list
 * Assume there's a better way to do this but alleviates the console warnings.
 */
const LinkAsDiv = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className={`cursor-pointer ${className}`} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};

export default function ProposalCard(props: ProposalInputs) {
  const { address } = useAccount();
  const { proposal, proposalFetchStatus, votes } = useProposalVoting(props.proposalId.toString());

  const proposalVariant = useProposalStatus(proposal!);
  const showLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const hasVoted = votes?.some(({ voter }) => voter === address);
  const winningOption = getWinningOption(proposal?.tally as Tally);

  if (!proposal && showLoading) {
    return (
      <section className="mb-4 w-full">
        <Card className="p-4">
          <span className="xs:px-10 px-4 py-5 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading proposal..." />
          </span>
        </Card>
      </section>
    );
  } else if (!proposal?.title && !proposal?.summary) {
    // We have the proposal but no metadata yet
    return (
      <LinkAsDiv href={`#/proposals/${props.proposalId}`} className="mb-4 w-full">
        <Card className="p-4">
          <span className="xs:px-10 px-4 py-5 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading metadata..." />
          </span>
        </Card>
      </LinkAsDiv>
    );
  } else if (proposalFetchStatus.metadataReady && !proposal?.title) {
    return (
      <LinkAsDiv href={`#/proposals/${props.proposalId}`} className="mb-4 w-full">
        <Card className="p-4">
          <div className="xl:4/5 overflow-hidden text-ellipsis text-nowrap pr-4 md:w-7/12 lg:w-3/4">
            <h4 className="mb-1 line-clamp-1 text-lg text-neutral-300">
              {Number(props.proposalId) + 1} - {DEFAULT_PROPOSAL_METADATA_TITLE}
            </h4>
            <p className="line-clamp-3 text-base text-neutral-300">{DEFAULT_PROPOSAL_METADATA_SUMMARY}</p>
          </div>
        </Card>
      </LinkAsDiv>
    );
  }

  return (
    <LinkAsDiv href={`#/proposals/${props.proposalId}`} className="mb-4 w-full cursor-pointer">
      <ProposalDataListItem.Structure
        title={proposal.title}
        summary={proposal.summary}
        voted={hasVoted}
        result={{
          option: winningOption?.option,
          voteAmount: winningOption?.voteAmount.toString(),
          votePercentage: winningOption?.votePercentage,
        }}
        publisher={[{ address: proposal.creator }]} // Fix: Pass an object of type IPublisher instead of a string
        status={proposalVariant!}
        type={"majorityVoting"}
      />
    </LinkAsDiv>
  );
}

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposalVoting>["proposal"],
  status: ReturnType<typeof useProposalVoting>["proposalFetchStatus"]
) {
  if (!proposal || status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
