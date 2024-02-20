import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { PublicClient } from "viem";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import {
  Proposal,
  VoteCastEvent,
  VoteCastResponse,
} from "@/plugins/tokenVoting/utils/types";

const event = getAbiItem({ abi: TokenVotingAbi, name: "VoteCast" });

export function useProposalVotes(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  proposal: Proposal | null
) {
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address,
      event: event as any,
      args: {
        proposalId,
      } as any,
      fromBlock: proposal.parameters.snapshotBlock,
      toBlock: "latest", // TODO: Make this variable between 'latest' and proposal last block
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}
