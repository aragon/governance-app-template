import Link from "next/link";
import { usePublicClient } from "wagmi";
import { Address } from "viem";
import { Proposal } from "@/tokenVoting/utils/types";
import { useProposal } from "@/tokenVoting/hooks/useProposal";
import { Button } from "@aragon/ods";
import { ReactNode } from "react";
import { IButtonProps } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { If } from "@/components/if";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY =
  "(The metadata of the proposal is not available)";
const PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS ||
  "") as Address;

type ButtonVariant = IButtonProps["variant"];
type ProposalInputs = {
  proposalId: bigint;
};

const getProposalVariantStatus = (proposal: Proposal) => {
  return {
    variant: (proposal?.active
      ? "secondary"
      : proposal?.executed
      ? "success"
      : proposal?.tally?.no >= proposal?.tally?.yes
      ? "critical"
      : "success") as ButtonVariant,
    label: proposal?.active
      ? "Active"
      : proposal?.executed
      ? "Executed"
      : proposal?.tally?.no >= proposal?.tally?.yes
      ? "Defeated"
      : "Executable",
  };
};

export default function ProposalCard(props: ProposalInputs) {
  const publicClient = usePublicClient();
  const { proposal, status } = useProposal(
    publicClient,
    PLUGIN_ADDRESS,
    props.proposalId.toString()
  );

  const showLoading = getShowProposalLoading(proposal, status);

  if (!proposal || showLoading) {
    return (
      <section className="pb-3 pt-3 w-full">
        <Card>
          <span className="px-4 py-5 xs:px-10 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading proposal..." />
          </span>
        </Card>
      </section>
    );
  } else if (status.metadataReady && !proposal?.title) {
    return (
      <section className="pb-3 pt-3 w-full">
        <Card>
          <Link
            href={`/proposals/${props.proposalId}`}
            className="flex justify-between px-4 py-5 xs:px-10 md:px-6 lg:px-7 cursor-pointer"
          >
            <div className="md:w-7/12 lg:w-3/4 xl:4/5 pr-4 text-nowrap text-ellipsis overflow-hidden">
              <h4 className="mb-1 text-lg text-neutral-300 line-clamp-1">
                {Number(props.proposalId) + 1} -{" "}
                {DEFAULT_PROPOSAL_METADATA_TITLE}
              </h4>
              <p className="text-base text-neutral-300 line-clamp-3">
                {DEFAULT_PROPOSAL_METADATA_SUMMARY}
              </p>
            </div>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="pb-3 pt-3 w-full">
      <Card>
        <Link
          href={`/proposals/${props.proposalId}`}
          className="flex justify-between px-4 py-5 xs:px-10 md:px-6 lg:px-7 cursor-pointer"
        >
          <div className="md:w-7/12 lg:w-3/4 xl:4/5 pr-4 text-nowrap text-ellipsis overflow-hidden">
            <h4 className="mb-1 text-lg font-semibold text-dark line-clamp-1">
              {Number(props.proposalId) + 1} - {proposal.title}
            </h4>
            <p className="text-base text-body-color line-clamp-3">
              {proposal.summary || DEFAULT_PROPOSAL_METADATA_SUMMARY}
            </p>
          </div>

          <div className="md:w-5/12 lg:w-1/4 xl:1/5">
            <If condition={proposal.tally}>
              <Button
                className="w-full"
                size="sm"
                variant={getProposalVariantStatus(proposal as Proposal).variant}
              >
                {getProposalVariantStatus(proposal as Proposal).label}
              </Button>
            </If>
          </div>
        </Link>
      </Card>
    </section>
  );
}

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full flex flex-col space-y-6 drop-shadow-sm hover:drop-shadow
    box-border focus:outline-none focus:ring focus:ring-primary
    hover:border-neutral-100 active:border-200
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal || status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
