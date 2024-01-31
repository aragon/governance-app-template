import { useState, useEffect } from 'react';
import { Address } from 'viem'
import { useContractRead } from 'wagmi';
import { fetchFromIPFS } from '@/utils/ipfs';
import { getAbiItem } from 'viem';
import { TokenVotingAbi } from '../artifacts/TokenVoting.sol';
import { Proposal, ProposalMetadata, ProposalParameters, Tally, Action, ProposalCreatedLogResponse } from '../utils/types';
import { useQuery } from 'react-query';

export function useProposal(publicClient: any, address: Address, proposalId: string) {
    const [proposal, setProposal] = useState<Proposal>();
    const [proposalLogs, setLogs] = useState<ProposalCreatedLogResponse>();
    const [proposalMetadata, setMetadata] = useState<string>();
  
    useContractRead({
      address,
      abi: TokenVotingAbi,
      functionName: 'getProposal',
      args: [proposalId],
      watch: true,
      onSuccess(data) {
        setProposal({
          open: (data as Array<boolean>)[0],
          executed: (data as Array<boolean>)[1],
          parameters: (data as Array<ProposalParameters>)[2],
          tally: (data as Array<Tally>)[3],
          actions: (data as Array<Array<Action>>)[4],
          allowFailureMap: (data as Array<bigint>)[5],
        } as Proposal)
      }
    });
  
    useEffect(() => {
      async function getLogs() {
        if (!proposal) return;
        const event = getAbiItem({ abi: TokenVotingAbi, name: 'ProposalCreated' });
        const logs: ProposalCreatedLogResponse[] = await publicClient.getLogs({
          address,
          event,
          args: {
            proposalId: proposalId,
          } as any,
          fromBlock: proposal.parameters.snapshotBlock,
          toBlock: proposal.parameters.startDate,
        });
        setLogs(logs[0]);
        setMetadata(logs[0].args.metadata);
      }
  
      getLogs();
    }, [proposal?.tally]);
  
    const { data: ipfsResponse, isLoading: ipfsLoading, error } = useQuery<ProposalMetadata, Error>(
      `ipfsData${proposalId}`,
      () => fetchFromIPFS(proposalMetadata),
      { enabled: proposalMetadata ? true : false }
    );
  
    return { ...proposalLogs, ...ipfsResponse, ...proposal };
  }