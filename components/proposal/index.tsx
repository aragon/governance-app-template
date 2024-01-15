import Link from "next/link";
import { usePublicClient } from "wagmi";
import { Address } from "viem";
import { Proposal } from "@/utils/types";
import { useProposal } from "@/hooks/useProposal";
import { Button } from "@aragon/ods";
import { ReactNode } from "react";
import { ButtonVariant } from "@aragon/ods/dist/types/src/components/button/button.api";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

type ProposalInputs = {
  proposalId: bigint;
};

const getProposalVariantStatus = (proposal: Proposal) => {
  return {
    variant: (proposal?.open
      ? "secondary"
      : proposal?.executed
      ? "success"
      : proposal?.tally?.no >= proposal?.tally?.yes
      ? "critical"
      : "success") as ButtonVariant,
    label: proposal?.open
      ? "Open"
      : proposal?.executed
      ? "Executed"
      : proposal?.tally!.no >= proposal?.tally!.yes
      ? "Defeated"
      : "Executable",
  };
};

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient();
  const proposal = useProposal(
    publicClient,
    pluginAddress,
    props.proposalId.toString()
  );

  if (!proposal.title) return null;

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
              {proposal.summary}
            </p>
          </div>

          <div className="md:w-5/12 lg:w-1/4 xl:1/5">
            {proposal.tally && (
              <Button
                className="w-full"
                size="sm"
                variant={getProposalVariantStatus(proposal as Proposal).variant}
              >
                {getProposalVariantStatus(proposal as Proposal).label}
              </Button>
            )}
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
      className="w-full flex flex-col space-y-6 shadow-lg
    box-border border border-neutral-0
    focus:outline-none focus:ring focus:ring-primary
    hover:border-neutral-100 active:border-200
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};
