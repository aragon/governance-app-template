import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { PublicClient } from "viem";
import { ApprovedEvent, ApprovedEventResponse, EmergencyProposal } from "@/plugins/emergency-multisig/utils/types";
import { EmergencyMultisigPluginAbi } from "../artifacts/EmergencyMultisigPlugin";

const event = getAbiItem({
  abi: EmergencyMultisigPluginAbi,
  name: "Approved",
});

export function useProposalApprovals(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  proposal: EmergencyProposal | null
) {
  const [proposalLogs, setLogs] = useState<ApprovedEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;

    const logs: ApprovedEventResponse[] = (await publicClient.getLogs({
      address,
      event: event,
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
