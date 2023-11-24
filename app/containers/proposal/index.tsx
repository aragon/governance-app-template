"use client";

import Link from 'next/link'
import { usePublicClient } from 'wagmi';
import { Address } from 'viem'
import { Proposal } from '@/utils/types';
import { useProposal } from '@/hooks/useProposal';
import { Button, } from '@aragon/ods'

const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

type ProposalInputs = {
  proposalId: bigint;
}

const getProposalVariantStatus = (proposal: Proposal) => {
  return {
    variant: proposal?.open ? 'secondary' : proposal?.executed ? 'success' : proposal?.tally?.no >= proposal?.tally?.yes ? 'critical' : 'success',
    label: proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute',
  }
}

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient()
  const proposal = useProposal(publicClient, pluginAddress, props.proposalId.toString());

  if (proposal.title) return (
    <section className="pb-6 pt-10 lg:pb-[15px] lg:pt-[20px] w-full">
      <Link href={`/proposals/${props.proposalId}`} className="bg-neutral-50 flex justify-between rounded-xl border border-stroke border-neutral-200 shadow-md px-4 py-5 xs:px-10 md:px-6 lg:px-7 cursor-pointer">
        <div className="">
          <h4 className="mb-1 text-lg font-semibold text-dark">
            {Number(props.proposalId) + 1} - {proposal.title}
          </h4>
          <p className="text-base text-body-color">
            {proposal.summary}
          </p>
        </div>

        <div className="w-full md:w-5/12 lg:w-1/3">
          <div className="flex items-center space-x-3 md:justify-end">
            {proposal.tally && (
              <Button
                size="lg"
                variant={getProposalVariantStatus((proposal as Proposal)).variant}
              >
                {getProposalVariantStatus((proposal as Proposal)).label}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </section>
  )
  else return (<></>)
}
