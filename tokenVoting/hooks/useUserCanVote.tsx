import { Address } from 'viem'
import { useContractRead, useAccount } from 'wagmi';
import { TokenVotingAbi } from '@/tokenVoting/artifacts/TokenVoting.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useUserCanVote(proposalId: bigint) {
    const { address, isConnecting, isDisconnected } = useAccount()

    const { data: canVote, isError, isLoading } = useContractRead({
                address: pluginAddress,
                abi: TokenVotingAbi,
                functionName: 'canVote',
                watch: true,
                args: [proposalId, address, 1]
    })

    return canVote
}
