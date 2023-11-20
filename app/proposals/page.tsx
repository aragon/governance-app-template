"use client";

import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Proposal from '../containers/proposal';
import { Address } from 'viem'
import { TokenVotingAbi } from '../../artifacts/TokenVoting.sol';

const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`

export default function Proposals() {
  const [numProposals, setNumProposals] = useState<number>();

  const { isLoading } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: 'proposalCount',
    // watch: true,
    onSuccess(data) {
      setNumProposals(Number(data));
    }
  })

  return (
    <main className="bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-semibold w-5/6 pt-12">Proposals</h1>
      {numProposals && [...Array(numProposals)].map((_, i) => (
        <Proposal key={i} proposalId={BigInt(numProposals - 1 - i)} />
      )
      )}
    </main>
  )
}


