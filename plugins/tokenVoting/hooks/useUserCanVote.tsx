import { Address } from 'viem'
import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { TokenVotingAbi } from '@/plugins/tokenVoting/artifacts/TokenVoting.sol';
import { useEffect } from 'react';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useUserCanVote(proposalId: bigint) {
    const { address } = useAccount()
    const { data: blockNumber } = useBlockNumber({watch: true})

    const { data: canVote, refetch: canVoteRefetch } = useReadContract({
                address: pluginAddress,
                abi: TokenVotingAbi,
                functionName: 'canVote',
                args: [proposalId, address, 1]
    })

    useEffect(() => {
        canVoteRefetch()
    }, [blockNumber])

    return canVote
}
