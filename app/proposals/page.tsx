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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Proposals</h1>
      {numProposals && [...Array(numProposals)].map((_, i) => (
        <Proposal key={i} proposalId={BigInt(numProposals - 1 - i)} />
      )
      )}
    </main>
  )
}


