import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { Hex, fromHex, getAbiItem } from "viem";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { Action } from "@/utils/types";
import { Proposal, ProposalMetadata, ProposalParameters, Tally } from "@/plugins/toucanVoting/utils/types";
import {
  PUB_CHAIN,
  PUB_TOUCAN_RECEIVER_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
} from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";
import { ToucanReceiverAbi } from "../artifacts/ToucanReceiver.sol";
import { optimismSepolia } from "viem/chains";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";

type ProposalCreatedLogResponse = {
  args: {
    actions: Action[];
    allowFailureMap: bigint;
    creator: string;
    endDate: bigint;
    startDate: bigint;
    metadata: string;
    proposalId: bigint;
  };
};

const ProposalCreatedEvent = getAbiItem({
  abi: TokenVotingAbi,
  name: "ProposalCreated",
});

export function useProposal(proposalId: string, autoRefresh = false) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });
  const [proposalCreationEvent, setProposalCreationEvent] = useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadata] = useState<string>();
  const { data: blockNumber } = useBlockNumber();

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
  });

  const { data: proposalRef } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_RECEIVER_ADDRESS,
    abi: ToucanReceiverAbi,
    functionName: "getProposalRef",
    args: [BigInt(proposalId)],
  });

  const { data: proposalL2Tally } = useReadContract({
    chainId: optimismSepolia.id,
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    functionName: "proposals",
    args: [proposalRef!],
    query: { enabled: !!proposalRef },
  });

  const proposalData = decodeProposalResultData(proposalResult as any, proposalL2Tally);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [blockNumber]);

  // Creation event
  useEffect(() => {
    if (!proposalData || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
        event: ProposalCreatedEvent as any,
        args: {
          proposalId: proposalId,
        } as any,
        fromBlock: BigInt(proposalData.parameters.snapshotBlock),
        toBlock: "latest",
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
        setMetadata(fromHex(log.args.metadata as Hex, "string"));
      })
      .catch((err) => {
        console.error("Could not fetch the proposal details", err);
      });
  }, [proposalData?.tally.yes, proposalData?.tally.no, proposalData?.tally.abstain, !!publicClient]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetadata<ProposalMetadata>(metadataUri);

  const proposal = arrangeProposalData(proposalData, proposalCreationEvent, metadataContent, proposalRef);

  return {
    proposal,
    status: {
      proposalReady: proposalFetchStatus === "idle",
      proposalLoading: proposalFetchStatus === "fetching",
      proposalError,
      metadataReady: !metadataError && !metadataLoading && !!metadataContent,
      metadataLoading,
      metadataError: metadataError !== undefined,
    },
  };
}

// Helpers

function decodeProposalResultData(data: Array<any>, l2Tally: any) {
  if (!data?.length || data.length < 6) return null;

  let finalTally: Tally = data[3];
  if (l2Tally) {
    finalTally = {
      yes: data[3].yes + l2Tally?.yes || 0n,
      no: data[3].no + l2Tally?.no || 0n,
      abstain: data[3].abstain + l2Tally?.abstain || 0n,
    };
  }

  return {
    active: data[0] as boolean,
    executed: data[1] as boolean,
    parameters: data[2] as ProposalParameters,
    tally: finalTally as Tally,
    actions: data[4] as Array<Action>,
    allowFailureMap: data[5] as bigint,
  };
}

function arrangeProposalData(
  proposalData?: ReturnType<typeof decodeProposalResultData>,
  creationEvent?: ProposalCreatedLogResponse["args"],
  metadata?: ProposalMetadata,
  proposalRef?: bigint
): Proposal | null {
  if (!proposalData) return null;

  return {
    proposalRef: proposalRef || 0n,
    actions: proposalData.actions,
    active: proposalData.active,
    executed: proposalData.executed,
    parameters: proposalData.parameters,
    tally: {
      yes: proposalData.tally.yes || 0n,
      no: proposalData.tally.no || 0n,
      abstain: proposalData.tally.abstain || 0n,
    },
    allowFailureMap: proposalData.allowFailureMap,
    creator: creationEvent?.creator || "",
    title: metadata?.title || "",
    summary: metadata?.summary || "",
    description: metadata?.description || "",
    resources: metadata?.resources || [],
  };
}
