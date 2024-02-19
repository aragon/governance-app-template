import { Address } from 'viem'
import { useState, useEffect } from 'react'
import { useBalance, useAccount, useReadContracts } from 'wagmi';
import { TokenVotingAbi } from '@/plugins/tokenVoting/artifacts/TokenVoting.sol';
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from '@/constants';

export function useCanCreateProposal() {
    const [isCreator, setIsCreator] = useState<boolean>(false);
    const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
    const [votingToken, setVotingToken] = useState<Address>();
    const { address, isConnecting, isDisconnected } = useAccount()
    const {data: balance} = useBalance({ address, token: votingToken, })

    const { data: contractReads } = useReadContracts({
        contracts: [
            {
                address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
                abi: TokenVotingAbi,
                functionName: 'minProposerVotingPower',
            },
            {
                address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
                abi: TokenVotingAbi,
                functionName: 'getVotingToken',
            }
        ]
    })

    useEffect(() => {
        if (contractReads?.length) {
            setMinProposerVotingPower(contractReads[0]?.result as bigint)

            setVotingToken(contractReads[1]?.result as Address)
        }
    }, [contractReads])

    useEffect(() => {
        if ( balance !== undefined && minProposerVotingPower !== undefined && balance?.value >= minProposerVotingPower) setIsCreator(true)
    }, [balance])

    return isCreator
}
