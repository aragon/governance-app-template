"use client";

import { usePublicClient } from 'wagmi';
import { Address } from 'viem'
import { Proposal } from '../../../utils/types';
import { useProposal } from '@/hooks/useProposal';

const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`

export default function Proposal({ params }: { params: { proposals: string } }) {
  const publicClient = usePublicClient()
  const proposal = useProposal(publicClient, pluginAddress, params.proposals);

  if (proposal.title) return (
    <section className="pb-6 pt-10 min-h-screen p-24 dark:bg-dark lg:pb-[15px] lg:pt-[20px]">
      <div className="flex justify-between px-4 py-5 xs:px-10 md:px-6 lg:px-7 cursor-pointer">
        <div className="">
          <h4 className="mb-1 text-l font-semibold text-dark dark:text-white xs:text-xl md:text-l lg:text-xl">
            {params.proposals?.toLocaleString()} - {proposal.title}
          </h4>
          <p className="text-base text-body-color dark:text-dark-6">
            {proposal.summary}
          </p>
        </div>

        <div className="w-full md:w-5/12 lg:w-1/3">
          <div className="flex items-center space-x-3 md:justify-end">
            {proposal.tally && (
              <p className={`
              inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium text-body-color shadow-1 dark:bg-dark dark:text-dark-6 dark:shadow-none border border-stroke
              ${proposal?.open ? 'bg-gray-50 border-gray-600 color-gray-800' : proposal?.executed ? 'bg-green-400 border-green-700' : proposal?.tally!.no >= proposal?.tally!.yes ? 'bg-red-400 border-red-700' : 'bg-blue-400 border-blue-700'}
            `}>
                {proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute'}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-between items-center rounded-lg border-2 border-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-bold pr-6">Thresshold</h2>
          <div className="flex-wrap items-right">
            <span className="text-xl mr-2">{proposal.parameters?.supportThreshold}</span>
            <p>voting power</p>
          </div>
        </div>
        <div className="flex justify-between items-center rounded-lg border-2 border-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-bold pr-6">Ends</h2>
          <div className="flex-wrap items-right">
            <span className="text-xl mr-2">{proposal.parameters?.endDate.toLocaleString()}</span>
            <p>unix time</p>
          </div>
        </div>
        <div className="flex justify-between items-center rounded-lg border-2 border-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-2xl font-bold pr-6">Snapshot</h2>
          <div className="flex-wrap items-right">
            <p>Taken at block</p>
            <span className="text-xl mr-2">{proposal.parameters?.snapshotBlock.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </section>
  )
  else return (<></>)
}


