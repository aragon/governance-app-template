import { usePublicClient, useReadContract } from "wagmi";
import { useProposalRef } from "./useProposalRef";
import { PUB_L2_CHAIN, PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS } from "@/constants";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { getAbiItem } from "viem";
import { Proposal, VotesDispatchedEvent, VotesDispatchedResponse } from "../utils/types";
import { useEffect, useState } from "react";
import { useProposal } from "./useProposal";
import { useRelayVotesList } from "./useProposalVoteList";
import { QueryKey } from "@tanstack/react-query";

export function useGetProposalVotesL2(proposalId: number) {
  const { proposalRef } = useProposalRef(proposalId);

  const {
    data: l2Votes,
    isLoading,
    isError,
    queryKey: proposalL2QueryKey,
  } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    chainId: PUB_L2_CHAIN.id,
    functionName: "proposals",
    args: [BigInt(proposalRef ?? 0)],
    query: { enabled: !!proposalRef },
  });

  return {
    l2Votes,
    isLoading,
    isError,
    proposalL2QueryKey,
  };
}

const VoteDispatchEvent = getAbiItem({ abi: ToucanRelayAbi, name: "VotesDispatched" });

export function useDispatchEvents(proposalId: string, proposal: Proposal | null) {
  const publicClient = usePublicClient({
    chainId: PUB_L2_CHAIN.id,
  });
  const [dispatchLogs, setLogs] = useState<VotesDispatchedEvent[]>([]);
  const { proposalRef } = useProposalRef(Number(proposalId));

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VotesDispatchedResponse[] = (await publicClient.getLogs({
      address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
      event: VoteDispatchEvent as any,
      args: {
        proposalRef,
      },
      // TODO: how can we do this in a performant way given l2 timestamps
      fromBlock: 0n,
      toBlock: "latest",
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > dispatchLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId]);

  return dispatchLogs;
}

export function useGetPendingVotesOnL2(proposalId: number): {
  queries: QueryKey[];
  hasPending: boolean;
  pending: { yes: bigint; no: bigint; abstain: bigint };
} {
  const { proposal, proposalQueryKey } = useProposal(proposalId.toString(), true);

  // get the vote list from the relay
  const votes = useRelayVotesList(proposalId.toString(), proposal);

  // get the dispatch events
  const dispatches = useDispatchEvents(proposalId.toString(), proposal);

  console.log({ proposal, votes, dispatches });

  if (!proposal || !votes || !dispatches || !dispatches.length) {
    return {
      queries: [proposalQueryKey],
      hasPending: false,
      pending: { yes: 0n, no: 0n, abstain: 0n },
    };
  }

  const lastDispatch = dispatches[dispatches.length - 1];

  // add the votes
  const totalVotes = votes.reduce(
    (prev, curr) => {
      return {
        yes: prev.yes + curr.voteOptions.yes,
        no: prev.no + curr.voteOptions.no,
        abstain: prev.abstain + curr.voteOptions.abstain,
      };
    },
    { yes: 0n, no: 0n, abstain: 0n }
  );

  // if this total is different from the last dispatch, we have pending votes
  const pending = {
    yes: totalVotes.yes - lastDispatch.votes.yes,
    no: totalVotes.no - lastDispatch.votes.no,
    abstain: totalVotes.abstain - lastDispatch.votes.abstain,
  };

  return {
    queries: [proposalQueryKey],
    hasPending: pending.yes !== 0n || pending.no !== 0n || pending.abstain !== 0n,
    pending,
  };
}
