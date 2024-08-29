import Link from "next/link";
import { useProposalApprove } from "@/plugins/multisig/hooks/useProposalApprove";
import { Card, ProposalStatus } from "@aragon/ods";
import { ProposalDataListItem } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalStatus } from "../../hooks/useProposalVariantStatus";
import { useAccount } from "wagmi";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY = "(The metadata of the proposal is not available)";

type ProposalInputs = {
  proposalId: bigint;
};

export default function ProposalCard(props: ProposalInputs) {
  const { address } = useAccount();
  const { proposal, proposalFetchStatus, approvals } = useProposalApprove(props.proposalId.toString());

  const proposalStatus = useProposalStatus(proposal!);
  const showLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const hasApproved = approvals?.some((veto) => veto.approver === address);

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
      <Link href={`#/proposals/${props.proposalId}`} className="mb-4 w-full">
        <Card className="p-4">
          <span className="xs:px-10 px-4 py-5 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading metadata..." />
          </span>
        </Card>
      </Link>
    );
  } else if (proposalFetchStatus.metadataReady && !proposal?.title) {
    return (
      <Link href={`#/proposals/${props.proposalId}`} className="mb-4 w-full">
        <Card className="p-4">
          <div className="xl:4/5 overflow-hidden text-ellipsis text-nowrap pr-4 md:w-7/12 lg:w-3/4">
            <h4 className="mb-1 line-clamp-1 text-lg text-neutral-300">
              {Number(props.proposalId) + 1} - {DEFAULT_PROPOSAL_METADATA_TITLE}
            </h4>
            <p className="line-clamp-3 text-base text-neutral-300">{DEFAULT_PROPOSAL_METADATA_SUMMARY}</p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <ProposalDataListItem.Structure
      title={proposal.title}
      summary={proposal.summary}
      href={`#/proposals/${props.proposalId}`}
      voted={hasApproved}
      date={
        [ProposalStatus.ACTIVE, ProposalStatus.ACCEPTED].includes(proposalStatus!) && proposal.parameters.expirationDate
          ? Number(proposal.parameters.expirationDate) * 1000
          : undefined
      }
      result={{
        approvalAmount: proposal.approvals,
        approvalThreshold: proposal.parameters.minApprovals,
      }}
      publisher={{ address: proposal.creator }}
      status={proposalStatus!}
      type={"approvalThreshold"}
    />
  );
}

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposalApprove>["proposal"],
  status: ReturnType<typeof useProposalApprove>["proposalFetchStatus"]
) {
  if (!proposal || status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
