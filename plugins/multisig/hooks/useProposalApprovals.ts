import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { PublicClient } from "viem";
import { MultisigProposal, ApprovedEvent, ApprovedEventResponse } from "@/plugins/multisig/utils/types";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin";

const event = getAbiItem({
  abi: MultisigPluginAbi,
  name: "Approved",
});

export function useProposalApprovals(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  proposal: MultisigProposal | null
) {
  const [proposalLogs, setLogs] = useState<ApprovedEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;

    const logs: ApprovedEventResponse[] = (await publicClient.getLogs({
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
