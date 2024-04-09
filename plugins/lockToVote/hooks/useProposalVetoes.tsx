import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { PublicClient } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/lockToVote/artifacts/OptimisticTokenVotingPlugin.sol";
import { Proposal, VetoCastEvent, VoteCastResponse } from "@/plugins/lockToVote/utils/types";

const event = getAbiItem({
  abi: OptimisticTokenVotingPluginAbi,
  name: "VetoCast",
});

export function useProposalVetoes(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  proposal: Proposal | null
) {
  const [proposalLogs, setLogs] = useState<VetoCastEvent[]>([]);

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
