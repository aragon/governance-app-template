import Link from "next/link";
import { useProposal } from "@/plugins/lockToVote/hooks/useProposal";
import { Card, Tag, TagVariant } from "@aragon/ods";
import * as DOMPurify from "dompurify";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVariantStatus } from "../../hooks/useProposalVariantStatus";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY =
  "(The metadata of the proposal is not available)";

type ProposalInputs = {
  proposalId: bigint;
};

export default function ProposalCard(props: ProposalInputs) {
  const { proposal, status } = useProposal(props.proposalId.toString());
  const proposalVariant = useProposalVariantStatus(proposal!);

  const showLoading = getShowProposalLoading(proposal, status);

  if (!proposal || showLoading) {
    return (
      <section className="w-full mb-4">
        <Card className="p-4">
          <span className="px-4 py-5 xs:px-10 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading proposal..." />
          </span>
        </Card>
      </section>
    );
  } else if (!proposal?.title && !proposal?.summary) {
    // We have the proposal but no metadata yet
    return (
      <Link href={`#/proposals/${props.proposalId}`} className="w-full mb-4">
        <Card className="p-4">
          <span className="px-4 py-5 xs:px-10 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading metadata..." />
          </span>
        </Card>
      </Link>
    );
  } else if (status.metadataReady && !proposal?.title) {
    return (
      <Link href={`#/proposals/${props.proposalId}`} className="w-full mb-4">
        <Card className="p-4">
          <div className="md:w-7/12 lg:w-3/4 xl:4/5 pr-4 text-nowrap text-ellipsis overflow-hidden">
            <h4 className="mb-1 text-lg text-neutral-300 line-clamp-1">
              {Number(props.proposalId) + 1} - {DEFAULT_PROPOSAL_METADATA_TITLE}
            </h4>
            <p className="text-base text-neutral-300 line-clamp-3">
              {DEFAULT_PROPOSAL_METADATA_SUMMARY}
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`#/proposals/${props.proposalId}`}
      className="w-full cursor-pointer mb-4"
    >
      <Card className="p-4">
        <div className="flex mb-2">
          <Tag
            variant={proposalVariant.variant as TagVariant}
            label={proposalVariant.label}
          />
        </div>
        <div className="text-ellipsis overflow-hidden">
          <h4 className=" mb-1 text-lg font-semibold text-dark line-clamp-1">
            {Number(props.proposalId) + 1} - {proposal.title}
          </h4>
          <div
            className="text-ellipsis overflow-hidden box line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: proposal.summary
                ? DOMPurify.sanitize(proposal.summary)
                : DEFAULT_PROPOSAL_METADATA_SUMMARY,
            }}
          />
        </div>
      </Card>
    </Link>
  );
}

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal || status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
