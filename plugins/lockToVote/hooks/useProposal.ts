import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { getAbiItem } from "viem";
import { ProposalMetadata, RawAction } from "@/utils/types";
import { Proposal, ProposalParameters } from "@/plugins/lockToVote/utils/types";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";

type ProposalCreatedLogResponse = {
  args: {
    actions: RawAction[];
    allowFailureMap: bigint;
    creator: string;
    endDate: bigint;
    startDate: bigint;
    metadata: string;
    proposalId: bigint;
  };
};

const ProposalCreatedEvent = getAbiItem({
  abi: LockToVetoPluginAbi,
  name: "ProposalCreated",
});

export function useProposal(proposalIdx: number, autoRefresh = false) {
  const publicClient = usePublicClient();
  const [proposalCreationEvent, setProposalCreationEvent] = useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadataUri] = useState<string>();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract({
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: LockToVetoPluginAbi,
    functionName: "getProposal",
    args: [BigInt(proposalIdx)],
    chainId: PUB_CHAIN.id,
  });
  const proposalData = decodeProposalResultData(proposalResult as any);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [!blockNumber || blockNumber % BigInt(3) === BigInt(0)]);

  // Creation event
  useEffect(() => {
    if (!proposalData || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        event: ProposalCreatedEvent,
        args: {
          proposalId: BigInt(proposalIdx),
        },
        fromBlock: proposalData.parameters.snapshotBlock,
        toBlock: proposalData.parameters.startDate,
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
        setMetadataUri(log.args.metadata);
      })
      .catch((err) => {
        console.error("Could not fetch the proposal details", err);
        return null;
      });
  }, [proposalData?.vetoTally, !!publicClient]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetadata<ProposalMetadata>(metadataUri);

  const proposal = arrangeProposalData(proposalData, proposalCreationEvent, metadataContent);

  return {
    proposal,
    refetch: proposalRefetch,
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

function decodeProposalResultData(data?: Array<any>) {
  if (!data?.length || data.length < 6) return null;

  return {
    active: data[0] as boolean,
    executed: data[1] as boolean,
    parameters: data[2] as ProposalParameters,
    vetoTally: data[3] as bigint,
    actions: data[4] as Array<RawAction>,
    allowFailureMap: data[5] as bigint,
  };
}

function arrangeProposalData(
  proposalData?: ReturnType<typeof decodeProposalResultData>,
  creationEvent?: ProposalCreatedLogResponse["args"],
  metadata?: ProposalMetadata
): Proposal | null {
  if (!proposalData) return null;

  return {
    actions: proposalData.actions,
    active: proposalData.active,
    executed: proposalData.executed,
    parameters: proposalData.parameters,
    vetoTally: proposalData.vetoTally,
    allowFailureMap: proposalData.allowFailureMap,
    creator: creationEvent?.creator || "",
    title: metadata?.title || "",
    summary: metadata?.summary || "",
    description: metadata?.description || "",
    resources: metadata?.resources || [],
  };
}
