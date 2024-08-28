import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { PublicClient } from "viem";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";
import { Proposal, VetoCastEvent, VoteCastResponse } from "../utils/types";

const event = getAbiItem({
  abi: LockToVetoPluginAbi,
  name: "VetoCast",
});

export function useProposalVetoes(
  publicClient: PublicClient,
  address: Address,
  proposalId: number,
  proposal: Proposal | null
) {
  const [proposalLogs, setLogs] = useState<VetoCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address,
      event,
      args: {
        proposalId: BigInt(proposalId),
      },
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
