import { useState, useEffect, useMemo } from "react";
import { getAbiItem } from "viem";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import {
  Proposal,
  VoteCastEvent,
  VoteCastRelayEvent,
  VoteCastRelayResponse,
  VoteCastResponse,
} from "@/plugins/toucanVoting/utils/types";
import { usePublicClient } from "wagmi";
import {
  PUB_CHAIN,
  PUB_L2_CHAIN,
  PUB_TOUCAN_RECEIVER_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
} from "@/constants";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { useProposalRef } from "./useProposalRef";
import { removeDuplicates } from "../utils/array";

const L1VotingEvent = getAbiItem({ abi: TokenVotingAbi, name: "VoteCast" });
const L2VotingEvent = getAbiItem({ abi: ToucanRelayAbi, name: "VoteCast" });

export function useProposalVoteList(proposalId: string, proposal: Proposal | null) {
  const publicClient = usePublicClient({
    chainId: PUB_CHAIN.id,
  });
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);
  // const proposalBlocks = useGetProposalBlocksTimestamp(proposalId, PUB_CHAIN.id);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
      event: L1VotingEvent as any,
      args: {
        proposalId,
      } as any,
      // TODO: how can we improve this in a performant way
      fromBlock: BigInt(proposal.parameters.snapshotBlock),
      toBlock: "latest",
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}

export function useRelayVotesList(proposalId: string, proposal: Proposal | null) {
  const { proposalRef } = useProposalRef(Number(proposalId));
  const publicClient = usePublicClient({
    chainId: PUB_L2_CHAIN.id,
  });
  const [proposalLogs, setLogs] = useState<VoteCastRelayEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VoteCastRelayResponse[] = (await publicClient.getLogs({
      address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
      event: L2VotingEvent as any,
      args: {
        proposalRef,
      },
      // TODO: how can we improve this in a performant way
      fromBlock: 0n,
      toBlock: "latest",
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);

    // find the last value in the new logs for each user
    const lastLogForEachAddress = newLogs
      .reverse()
      .filter((log, index, self) => self.findIndex((l) => l.voter === log.voter) === index);

    if (lastLogForEachAddress.length > proposalLogs.length) setLogs(lastLogForEachAddress);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}

// performance wise, this is O(n^2) and should be optimized
// so we disable it as the number of votes grows super large
// and we memoize the result to be safe
export function useCombinedVotesList(proposalId: string, proposal: Proposal | null) {
  const votes = useProposalVoteList(proposalId, proposal);
  const l2Votes = useRelayVotesList(proposalId, proposal);

  return useMemo(() => {
    // remove the receiver as it's a proxy
    const votesNoReceiver = votes.filter((vote) => vote.voter !== PUB_TOUCAN_RECEIVER_ADDRESS);

    // filter the L1 votes
    const l1Filtered = votesNoReceiver.length <= 1000 ? removeDuplicates(votesNoReceiver, "voter") : votesNoReceiver;

    return l1Filtered;
  }, [votes, l2Votes, proposalId, proposal]);
}
