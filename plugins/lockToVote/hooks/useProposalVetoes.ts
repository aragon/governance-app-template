import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";
import { Proposal, VetoCastEvent, VoteCastResponse } from "../utils/types";
import { usePublicClient } from "wagmi";
import { PUB_CHAIN } from "@/constants";

const event = getAbiItem({
  abi: LockToVetoPluginAbi,
  name: "VetoCast",
});

export function useProposalVetoes(pluginAddress: Address, proposalId: number, proposal: Proposal | null) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });
  const [proposalLogs, setLogs] = useState<VetoCastEvent[]>([]);

  async function getLogs() {
    if (!publicClient || !proposal?.parameters?.snapshotBlock) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address: pluginAddress,
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
  }, [!!publicClient, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}
