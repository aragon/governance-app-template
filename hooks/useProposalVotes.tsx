import { useState, useEffect } from 'react';
import { Address, getAbiItem } from 'viem';
import { TokenVotingAbi } from '../artifacts/TokenVoting.sol';
import { Proposal, VoteCastEvent, VoteCastResponse } from '../utils/types';

export function useProposalVotes(publicClient: any, address: Address, proposalId: string, proposal: Proposal) {
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return
    const event = getAbiItem({ abi: TokenVotingAbi, name: 'VoteCast' });
    const logs: VoteCastResponse[] = await publicClient.getLogs({
      address,
      event,
      args: {
        proposalId,
      } as any,
      fromBlock: proposal.parameters.snapshotBlock,
      toBlock: 'latest', // TODO: Make this variable between 'latest' and proposal last block
    });
    const newLogs = logs.flatMap(log => log.args)
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs()
  }, [proposal]);

  return proposalLogs;
}
