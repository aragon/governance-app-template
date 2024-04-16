import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { Hex, fromHex, getAbiItem } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { Action } from "@/utils/types";
import {
  Proposal,
  ProposalMetadata,
  ProposalParameters,
  ProposalResultType,
} from "@/plugins/dualGovernance/utils/types";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";

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
  abi: OptimisticTokenVotingPluginAbi,
  name: "ProposalCreated",
});

export function useProposal(proposalId: string, autoRefresh = false) {
  const publicClient = usePublicClient();
  const [proposalCreationEvent, setProposalCreationEvent] = useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadata] = useState<string>();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
    chainId: PUB_CHAIN.id,
  });

  const proposalData = decodeProposalResultData(proposalResult);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [blockNumber]);

  // Creation event
  useEffect(() => {
    if (!proposalData || !publicClient) return;

    publicClient
      .getLogs({
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        event: ProposalCreatedEvent as any,
        args: {
          proposalId,
        } as any,
        fromBlock: proposalData.parameters.snapshotBlock,
        toBlock: proposalData.parameters.startDate,
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
        setMetadata(fromHex(log.args.metadata as Hex, "string"));
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

function decodeProposalResultData(data?: ProposalResultType) {
  if (!data?.length || data.length < 6) return null;

  return {
    active: data[0] as boolean,
    executed: data[1] as boolean,
    parameters: data[2] as ProposalParameters,
    vetoTally: data[3] as bigint,
    actions: data[4] as Array<Action>,
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
    resources: metadata?.resources || [],
  };
}
