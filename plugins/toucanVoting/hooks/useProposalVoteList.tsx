import { useState, useEffect } from "react";
import { getAbiItem } from "viem";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { Proposal, VoteCastEvent, VoteCastResponse } from "@/plugins/toucanVoting/utils/types";
import { usePublicClient } from "wagmi";
import { PUB_CHAIN, PUB_TOUCAN_VOTING_PLUGIN_ADDRESS } from "@/constants";

const event = getAbiItem({ abi: TokenVotingAbi, name: "VoteCast" });

export function useProposalVoteList(proposalId: string, proposal: Proposal | null) {
  const publicClient = usePublicClient({
    chainId: PUB_CHAIN.id,
  });
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
      event: event as any,
      args: {
        proposalId,
      } as any,
      fromBlock: BigInt(proposal.parameters.snapshotBlock),
      toBlock: "latest", // TODO: Make this variable between 'latest' and proposal last block
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}
