"use client";

import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Proposal from '../containers/proposal';
import { Address } from 'viem'
import { TokenVotingAbi } from '../../artifacts/TokenVoting.sol';
import { Button, IconType } from '@aragon/ods'
import { useCanCreateProposal } from '@/hooks/useCanCreateProposal';

const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export default function Proposals() {
  const [numProposals, setNumProposals] = useState<number>();
  const canCreate = useCanCreateProposal();

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
    <main className="flex flex-col items-center mt-6 w-screen max-w-full">
      <div className="flex flex-row justify-between content-center w-full mb-6">
        <h1 className="justify-self-start text-3xl font-semibold align-middle">Proposals</h1>
        <div className="justify-self-end">
          {canCreate && (
            <a href="/create">
              <Button
                iconLeft={IconType.ADD}
                size="lg"
                variant='primary'
              >
                Submit Proposal
              </Button>
            </a>
          )}
        </div>
      </div>
      {numProposals && [...Array(numProposals)].map((_, i) => (
        <Proposal key={i} proposalId={BigInt(numProposals - 1 - i)} />
      )
      )}
    </main>
  )
}


