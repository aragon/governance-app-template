import { Address } from 'viem'
import { useState, useEffect } from 'react'
import { useBalance, useAccount, useReadContracts } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useCanCreateProposal() {
    const [isCreator, setIsCreator] = useState<boolean>(false);
    const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
    const [votingToken, setVotingToken] = useState<Address>();
    const { address, isConnecting, isDisconnected } = useAccount()
    const {data: balance} = useBalance({ address, token: votingToken, })

    const { data: contractReads } = useReadContracts({
        contracts: [
            {
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'minProposerVotingPower',
            },
            {
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
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
        if ( balance && minProposerVotingPower && balance?.value >= minProposerVotingPower) setIsCreator(true)
    }, [balance])

    return isCreator
}
