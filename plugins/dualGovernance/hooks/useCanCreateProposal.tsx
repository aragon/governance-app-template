import { Address } from 'viem'
import { useState, useEffect } from 'react'
import { useBalance, useAccount, useReadContracts } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol';
import { goerli } from 'viem/chains';


const pluginAddress = ((process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS || "") as Address)
// const daoAddress = ((process.env.NEXT_PUBLIC_DAO_ADDRESS || "") as Address)

export function useCanCreateProposal() {
    const [isCreator, setIsCreator] = useState<boolean>(false);
    const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
    const [votingToken, setVotingToken] = useState<Address>();
    const { address, isConnecting, isDisconnected } = useAccount()
    const {data: balance} = useBalance({ address, token: votingToken, chainId: goerli.id })

    const { data: contractReads } = useReadContracts({
        contracts: [
            {
                chainId: goerli.id,
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'minProposerVotingPower',
            },
            {
                chainId: goerli.id,
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'getVotingToken',
            }
            // TODO: This needs to be checking as well if address has the DAO permission to create props
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
