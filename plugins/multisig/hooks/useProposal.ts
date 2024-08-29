import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { getAbiItem } from "viem";
import { MultisigPluginAbi } from "@/plugins/multisig/artifacts/MultisigPlugin";
import { RawAction, ProposalMetadata } from "@/utils/types";
import {
  MultisigProposal,
  MultisigProposalParameters,
  MultisigProposalResultType,
} from "@/plugins/multisig/utils/types";
import { PUB_CHAIN, PUB_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";

const ProposalCreatedEvent = getAbiItem({
  abi: MultisigPluginAbi,
  name: "ProposalCreated",
});

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

export function useProposal(proposalId: string, autoRefresh = false) {
  const publicClient = usePublicClient();
  const [proposalCreationEvent, setProposalCreationEvent] = useState<ProposalCreatedLogResponse["args"]>();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Proposal onchain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract({
    address: PUB_MULTISIG_PLUGIN_ADDRESS,
    abi: MultisigPluginAbi,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
    chainId: PUB_CHAIN.id,
  });

  const proposalData = decodeProposalResultData(proposalResult);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [blockNumber]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetadata<ProposalMetadata>(proposalData?.metadataUri);

  const proposal = arrangeProposalData(proposalData, proposalCreationEvent, metadataContent);

  useEffect(() => {
    if (!proposalData || !publicClient || proposalCreationEvent) return;

    publicClient
      .getLogs({
        address: PUB_MULTISIG_PLUGIN_ADDRESS,
        event: ProposalCreatedEvent,
        args: { proposalId: BigInt(proposalId) },
        fromBlock: proposalData.parameters.snapshotBlock,
        toBlock: "latest",
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
      })
      .catch((err) => {
        console.error("Could not fetch the proposal details", err);
        return null;
      });
  }, [proposalData, !!publicClient]);

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

function decodeProposalResultData(data?: MultisigProposalResultType) {
  if (!data?.length) return null;

  return {
    executed: data[0] as boolean,
    approvals: data[1] as number,
    parameters: data[2] as MultisigProposalParameters,
    metadataUri: data[3] as string,
    actions: data[4] as Array<RawAction>,
  };
}

function arrangeProposalData(
  proposalData?: ReturnType<typeof decodeProposalResultData>,
  creationEvent?: ProposalCreatedLogResponse["args"],
  metadata?: ProposalMetadata
): MultisigProposal | null {
  if (!proposalData) return null;

  return {
    actions: proposalData.actions,
    executed: proposalData.executed,
    parameters: {
      expirationDate: proposalData.parameters.expirationDate,
      snapshotBlock: proposalData.parameters.snapshotBlock,
      minApprovals: proposalData.parameters.minApprovals,
    },
    approvals: proposalData.approvals,
    allowFailureMap: BigInt(0),
    creator: creationEvent?.creator || "",
    title: metadata?.title || "",
    summary: metadata?.summary || "",
    description: metadata?.description || "",
    resources: metadata?.resources || [],
  };
}
