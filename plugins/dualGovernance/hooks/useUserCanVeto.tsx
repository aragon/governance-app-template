import { Address } from 'viem'
import { useAccount, useBlockNumber, useReadContract } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol';
import { useEffect } from 'react';
import { goerli } from 'viem/chains';


const pluginAddress = ((process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS || "") as Address)

export function useUserCanVeto(proposalId: bigint) {
    const { address } = useAccount()
    const { data: blockNumber } = useBlockNumber({watch: true})

    const { data: canVeto, refetch: canVetoRefetch } = useReadContract({
                chainId: goerli.id,
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'canVeto',
                args: [proposalId, address]
    })

    useEffect(() => {
        canVetoRefetch()
    }, [blockNumber])

    return canVeto
}
