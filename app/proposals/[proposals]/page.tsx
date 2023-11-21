"use client";

import { usePublicClient } from 'wagmi';
import {useState} from 'react'
import { Address } from 'viem'
import { Proposal } from '../../../utils/types';
import { useProposal } from '@/hooks/useProposal';
import { useProposalVotes } from '@/hooks/useProposalVotes';
import { Button, AlertCard } from '@aragon/ods'
import ProposalDescription from '@/app/containers/proposalDescription';
import VotesSection from '@/app/containers/votesSection';
import Blockies from 'react-blockies';
import { formatUnits } from 'viem'
import { formatAddress } from '@/utils/addressHelper'
import * as dayjs from 'dayjs'


const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`


export default function Proposal({ params }: { params: { proposals: string } }) {
  const publicClient = usePublicClient()
  const proposal = (useProposal(publicClient, pluginAddress, params.proposals) as Proposal);
  const votes = useProposalVotes(publicClient, pluginAddress, params.proposals, proposal);
  const [descriptionSection, setDescriptionSection] = useState<boolean>(true);


  if (proposal.title) return (
    <section className="pb-6 pt-10 min-h-screen p-24 dark:bg-dark lg:pb-[15px] lg:pt-[20px]">
      <div className="flex justify-between px-4 py-5 xs:px-10 md:px-6 lg:px-7 ">
        <div className="">
          <div className="flex flex-row pb-2 content-center items-center">
            <h4 className="text-xl font-semibold text-neutral-600 align-middle">
              Proposal {Number(params.proposals) + 1}
            </h4>
            <div className="pl-3 align-middle">
              {proposal.tally && (
                <AlertCard
                  className="flex h-5 items-center"
                  description=""
                  message={proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute'}
                  variant={proposal?.open ? 'secondary' : proposal?.executed ? 'success' : proposal?.tally!.no >= proposal?.tally!.yes ? 'critical' : 'info'}
                />
              )}
            </div>

          </div>
          <h4 className="mb-1 text-3xl text-neutral-900 font-semibold">
            {proposal.title}
          </h4>
          <p className="text-base text-l text-body-color dark:text-dark-6">
            Proposed by
            <span className="text-critical-400"> {formatAddress(proposal.args?.creator)} </span>
            until
            <span className="text-critical-400"> {dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 my-12">
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-success-500 font-semibold">For</p>
            <p className="text-xl font-semibold">{formatUnits(proposal.tally?.yes, 18)}</p>
          </div>
          <div className="h-4 w-full bg-success-100 rounded"><div className="h-4 w-12 bg-success-800 rounded"></div></div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 2).map(vote => (
              <Blockies
                className="rounded-2xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-critical-500 font-semibold">Against</p>
            <p className="text-xl font-semibold">{formatUnits(proposal.tally?.no, 18)}</p>
          </div>
          <div className="h-4 w-full bg-critical-100 rounded"><div className="h-4 w-24 bg-critical-800 rounded"></div></div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 0).map(vote => (
              <Blockies
                className="rounded-2xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-neutral-500 font-semibold">Abstain</p>
            <p className="text-xl font-semibold">{formatUnits(proposal.tally?.abstain, 18)}</p>
          </div>
          <div className="h-4 w-full bg-neutral-100 rounded"><div className="h-4 w-1 bg-neutral-800 rounded"></div></div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 1).map(vote => (
              <Blockies
                className="rounded-2xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>

        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-2xl flex-grow font-bold pr-6">Thresshold</h2>
          <div className="items-right text-right flex-wrap">
            <span className="text-xl">{proposal.parameters?.supportThreshold}</span>
            <p>voting power</p>
          </div>
        </div>
        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-2xl flex-grow font-bold pr-6">Ends</h2>
          <div className="items-right text-right flex-wrap">
            <span className="text-xl mr-2">{dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
            <p>unix time</p>
          </div>
        </div>
        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-2xl flex-grow font-bold pr-6">Snapshot</h2>
          <div className="items-right text-right flex-wrap">
            <p>Taken at block</p>
            <span className="text-xl mr-2">{proposal.parameters?.snapshotBlock.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            { descriptionSection ? 'Description' : 'Votes'}
            </h2>
          <div className="flex flex-row gap-4">
            <h2 className="px-3 py-2 border-2 border-primary-500 rounded-3xl" onClick={() => setDescriptionSection(true)}>Description</h2>
            <h2 className="px-3 py-2 border-2 border-primary-500 rounded-3xl" onClick={() => setDescriptionSection(false)}>Votes</h2>
          </div>
        </div>
      </div>
      {
        descriptionSection ? (<ProposalDescription {...proposal} />) : (<VotesSection votes={votes} />)
      }
    </section>
  )
  else return (<></>)
}


