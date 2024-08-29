import { useState, useEffect } from "react";
import { getAbiItem } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/optimistic-proposals/artifacts/OptimisticTokenVotingPlugin.sol";
import { VetoCastEvent } from "@/plugins/optimistic-proposals/utils/types";
import { usePublicClient } from "wagmi";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

const event = getAbiItem({
  abi: OptimisticTokenVotingPluginAbi,
  name: "VetoCast",
});

export function useProposalVetoes(proposalId?: bigint) {
  const publicClient = usePublicClient();
  const [proposalLogs, setLogs] = useState<VetoCastEvent[]>([]);

  useEffect(() => {
    if (!proposalId || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        event: event,
        args: {
          proposalId,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      })
      .then((logs) => {
        const newLogs = logs.flatMap((log) => log.args as VetoCastEvent);
        if (newLogs.length > proposalLogs.length) setLogs(newLogs);
      });
  }, [proposalId, publicClient?.chain.id]);

  return proposalLogs;
}
