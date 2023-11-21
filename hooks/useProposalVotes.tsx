import { useState, useEffect } from 'react';
import { Address } from 'viem'
import { getAbiItem } from 'viem';
import { TokenVotingAbi } from '../artifacts/TokenVoting.sol';
import { Proposal } from '../utils/types';

type VoteCastResponse = {
  args: VoteCastEvent[];
}

type VoteCastEvent = {
  voter: Address;
  proposalId: bigint;
  voteOption: number;
  votingPower: bigint;
}

export function useProposalVotes(publicClient: any, address: Address, proposalId: string, proposal: Proposal) {
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>();
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
