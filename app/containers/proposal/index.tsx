"use client";

import Link from 'next/link'
import { usePublicClient } from 'wagmi';
import { Address } from 'viem'
import { Proposal } from '@/utils/types';
import { useProposal } from '@/hooks/useProposal';

const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`

type ProposalInputs = {
  proposalId: bigint;
}

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient()
  const {proposal, proposalLogs, ipfsResponse } = useProposal(publicClient, pluginAddress, props.proposalId.toString());

  if (proposalLogs) return (
    <section className="pb-6 pt-10 dark:bg-dark lg:pb-[15px] lg:pt-[20px] w-5/6">
      <Link href={`/proposals/${props.proposalId}`} className="bg-blue-50 flex justify-between rounded-lg border border-stroke px-4 py-5 dark:border-dark-3 dark:bg-dark-2 xs:px-10 md:px-6 lg:px-7 cursor-pointer">
        <div className="">
          <h4 className="mb-1 text-l font-semibold text-dark dark:text-white xs:text-xl md:text-l lg:text-xl">
            {props.proposalId.toLocaleString()} - {ipfsResponse && ipfsResponse.title}
          </h4>
          <p className="text-base text-body-color dark:text-dark-6">
            {ipfsResponse && ipfsResponse.summary}
          </p>
        </div>

        <div className="w-full md:w-5/12 lg:w-1/3">
          <div className="flex items-center space-x-3 md:justify-end">
            <p className={`
              inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium text-body-color shadow-1 dark:bg-dark dark:text-dark-6 dark:shadow-none border border-stroke
              ${proposal?.open ? 'bg-gray-50 border-gray-600 color-gray-800' : proposal?.executed ? 'bg-green-400 border-green-700' : proposal?.tally.no >= proposal?.tally.yes ? 'bg-red-400 border-red-700' : 'bg-blue-400 border-blue-700'}
            `}>
              {proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally.no >= proposal?.tally.yes ? 'Defeated' : 'To Execute'}
            </p>
          </div>
        </div>
      </Link>
    </section>
  )
  else return (<></>)
}


