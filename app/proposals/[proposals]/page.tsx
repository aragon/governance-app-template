"use client";

import { usePublicClient, useAccount, useContractWrite } from 'wagmi';
import { useState } from 'react'
import { Address } from 'viem'
import { Proposal } from '../../../utils/types';
import { useProposal } from '@/hooks/useProposal';
import { useProposalVotes } from '@/hooks/useProposalVotes';
import { Button, AlertCard, Tag } from '@aragon/ods'
import ProposalDescription from '@/app/containers/proposalDescription';
import VotesSection from '@/app/containers/votesSection';
import Blockies from 'react-blockies';
import { formatUnits } from 'viem'
import { formatAddress } from '@/utils/addressHelper'
import { useUserCanVote } from '@/hooks/useUserCanVote';
import * as dayjs from 'dayjs'
import { TokenVotingAbi } from '@/artifacts/TokenVoting.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

const getProposalVariantStatus = (proposal: Proposal) => {
  return {
    variant: proposal?.open ? 'info' : proposal?.executed ? 'success' : proposal?.tally?.no >= proposal?.tally?.yes ? 'critical' : 'success',
    label: proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute',
  }
}

export default function Proposal({ params }: { params: { proposals: string } }) {
  const publicClient = usePublicClient()
  const proposal = (useProposal(publicClient, pluginAddress, params.proposals) as Proposal);
  const votes = useProposalVotes(publicClient, pluginAddress, params.proposals, proposal);
  const userCanVote = useUserCanVote(BigInt(params.proposals))
  const [descriptionSection, setDescriptionSection] = useState<boolean>(true);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [userVotedOption, setUserVotedOption] = useState<number>();
  const [userExecutedVote, setUserExecutedVote] = useState<boolean>();
  const { write: voteWrite } = useContractWrite({
    abi: TokenVotingAbi,
    address: pluginAddress,
    functionName: 'vote',
    args: [params.proposals, userVotedOption, 0],
    onSuccess(data) {
      console.log('Success creating the proposal', data)
      setUserExecutedVote(true)
    },
  });

  const { address, isConnecting, isDisconnected } = useAccount()

  const votingPercentages = () => {
    if (!proposal.tally) return { yes: 0, no: 0, abstain: 0 }

    let yesVotes = Number(formatUnits(proposal.tally.yes || BigInt(0), 18));
    let noVotes = Number(formatUnits(proposal.tally.no || BigInt(0), 18));
    let abstainVotes = Number(formatUnits(proposal.tally.abstain || BigInt(0), 18));
    let totalVotes = yesVotes + noVotes + abstainVotes;


    return {
      yes: yesVotes / totalVotes * 100,
      no: noVotes / totalVotes * 100,
      abstain: abstainVotes / totalVotes * 100
    };
  }

  const userVote = () => votes.find(vote => vote.voter === address)?.voteOption

  const getUserVoteData = () => {
    if (userVote() === 0) {
      return { variant: 'critical', label: 'Against' }
    } else if (userVote() === 1) {
      return { variant: 'tertiary', label: 'Abstain' }
    } else {
      return { variant: 'success', label: 'For' }
    }
  }

  const voteFor = (option: number) => {
    setUserVotedOption(option)
    voteWrite?.()
    setShowVotingModal(false)
  }

  if (proposal.title) return (
    <section className="pb-6 pt-10 min-h-screen p-24 dark:bg-dark lg:pb-[15px] lg:pt-[20px]">
      <div className="flex justify-between px-4 py-5 xs:px-10 md:px-6 lg:px-7 ">
        <div className="w-full">
          <div className="flex flex-row pb-2 content-center items-center ">
            <div className="flex flex-grow">
              <h4 className="text-xl font-semibold text-neutral-600 align-middle">
                Proposal {Number(params.proposals) + 1}
              </h4>
              <div className="pl-3 align-middle">
                {proposal.tally && (
                  <AlertCard
                    className="flex h-5 items-center"
                    description={getProposalVariantStatus((proposal as Proposal)).label}
                    variant={getProposalVariantStatus((proposal as Proposal)).variant}
                  />
                )}
              </div>
            </div>
            <div className="flex ">
              {userCanVote ?
                <Button
                  className="flex h-5 items-center"
                  size="lg"
                  variant="primary"
                  onClick={() => setShowVotingModal(true)}
                >Vote</Button>
                : userVote() && (
                  <div className="flex items-center align-center">
                    <span className="text-lg text-neutral-800 font-semibold pr-4">Voted: </span>
                    <Button
                      className="flex h-5 items-center"
                      size="lg"
                      variant={getUserVoteData().variant}
                    >{getUserVoteData().label}</Button>
                  </div>
                )}
            </div>

          </div>
          <h4 className="mb-1 text-3xl text-neutral-900 font-semibold">
            {proposal.title}
          </h4>
          <p className="text-base text-l text-body-color dark:text-dark-6">
            Proposed by
            <span className="text-primary-400 font-semibold underline"> {formatAddress(proposal.args?.creator)} </span>
            until
            <span className="text-primary-400 font-semibold"> {dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 my-12">
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-success-700 font-semibold">For</p>
            <p className="text-xl font-semibold">{formatUnits(proposal?.tally?.yes || BigInt(0), 18)}</p>
          </div>
          <div className="h-4 w-full bg-success-100 rounded">
            <div className="h-4 bg-success-800 rounded" style={{ width: `${votingPercentages().yes}%` }}></div>
          </div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 2).map(vote => (
              <Blockies
                key={vote?.voter}
                size={11}
                className="rounded-3xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-critical-700 font-semibold">Against</p>
            <p className="text-xl font-semibold">{formatUnits(proposal?.tally?.no || BigInt(0), 18)}</p>
          </div>
          <div className="h-4 w-full bg-critical-100 rounded">
            <div className="h-4 bg-critical-800 rounded" style={{ width: `${votingPercentages().no}%` }}></div>
          </div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 0).map(vote => (
              <Blockies
                key={vote?.voter}
                size={12}
                className="rounded-3xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
          <div className="flex flex-row space-between pb-2">
            <p className="flex-grow text-xl text-neutral-700 font-semibold">Abstain</p>
            <p className="text-xl font-semibold">{formatUnits(proposal?.tally?.abstain || BigInt(0), 18)}</p>
          </div>
          <div className="h-4 w-full bg-neutral-100 rounded">
            <div className="h-4 bg-neutral-800 rounded" style={{ width: `${votingPercentages().abstain}%` }}></div>
          </div>
          <div className="mt-4 grid grid-cols-5 space-between">
            {votes && votes.filter(vote => vote.voteOption === 1).map(vote => (
              <Blockies
                key={vote?.voter}
                size={11}
                className="rounded-3xl"
                seed={vote?.voter}
              />
            ))}
          </div>
        </div>

        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">Thresshold</h2>
          <div className="items-right text-right flex-wrap">
            <span className="text-xl font-semibold">{proposal.parameters?.supportThreshold}</span>
            <p className="text-neutral-600">voting power</p>
          </div>
        </div>
        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-xl flex-grow font-semibold pr-6 text-neutral-600">Ends</h2>
          <div className="items-right text-right flex-wrap">
            <span className="text-xl mr-2 font-semibold">{dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
            <p className="text-neutral-600">unix time</p>
          </div>
        </div>
        <div className="flex space-between border border-neutral-300 rounded-2xl py-5 px-3 m-2">
          <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">Snapshot</h2>
          <div className="items-right text-right flex-wrap">
            <p className="text-neutral-600">Taken at block</p>
            <span className="text-xl mr-2 font-semibold">{proposal.parameters?.snapshotBlock.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="py-12">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {descriptionSection ? 'Description' : 'Votes'}
          </h2>
          <div className="flex flex-row gap-4">
            <h2 className={`px-3 py-2 border-2 rounded-3xl hover:bg-primary-500 hover:text-neutral-50 hover:border-primary-500 ${descriptionSection ? 'border-primary-500' : 'border-neutral-500'}`} onClick={() => setDescriptionSection(true)}>Description</h2>
            <h2 className={`px-3 py-2 border-2 rounded-3xl hover:bg-primary-500 hover:text-neutral-50 hover:border-primary-500 ${!descriptionSection ? 'border-primary-500' : 'border-neutral-500'}`} onClick={() => setDescriptionSection(false)}>Votes</h2>
          </div>
        </div>
      </div>
      {
        descriptionSection ? (<ProposalDescription {...proposal} />) : (<VotesSection votes={votes} />)
      }
      {showVotingModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-50 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-primary-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-neutral-700">
                    Choose wisely
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-neutral-800 opacity-1 float-right text-3xl "
                    onClick={() => setShowVotingModal(false)}
                  >
                    <span className="bg-transparent text-neutral-800 opacity-1 h-6 w-6 text-2xl block font-semibold">
                      ×
                    </span>
                  </button>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-neutral-200 rounded-b">
                  <Button
                    className="flex h-5 items-center m-2"
                    size="md"
                    variant="success"
                    onClick={() => voteFor(2)}
                  >For</Button>
                  <Button
                    className="flex h-5 items-center m-2"
                    size="md"
                    variant="critical"
                    onClick={() => voteFor(3)}
                  >Against</Button>

                  <Button
                    className="flex h-5 items-center m-2"
                    size="md"
                    variant="tertiary"
                    onClick={() => voteFor(1)}
                  >Abstain</Button>

                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-neutral-900"></div>
        </>
      )}
    </section>
  )
}


