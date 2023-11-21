import { useState, useEffect } from 'react';
import { Address, getAbiItem } from 'viem';
import { TokenVotingAbi } from '../artifacts/TokenVoting.sol';
import { Proposal, VoteCastEvent, VoteCastResponse } from '../utils/types';

export function useProposalVotes(publicClient: any, address: Address, proposalId: string, proposal: Proposal) {
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);
  const [centinel, setCentinel] = useState<boolean>(false);

  useEffect(() => {
    async function getLogs() {
      if (!proposal?.parameters?.snapshotBlock || centinel) return;

      const event = getAbiItem({ abi: TokenVotingAbi, name: 'VoteCast' });
      const logs: VoteCastResponse[] = await publicClient.getLogs({
        address,
        event,
        args: {
          proposalId,
        } as any,
        fromBlock: proposal.parameters.snapshotBlock,
        toBlock: 'latest',
      });
      setLogs(logs.flatMap(log => log.args));
      setCentinel(true)
    }

    getLogs();
  }, [proposal]);

  return proposalLogs;
}
