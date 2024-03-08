import { useState, useEffect } from "react";
import { Address } from "viem";
import { useBlockNumber, useReadContract } from "wagmi";
import { fetchJsonFromIpfs } from "@/utils/ipfs";
import { PublicClient, getAbiItem } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { Action } from "@/utils/types";
import {
  Proposal,
  ProposalMetadata,
  ProposalParameters,
} from "@/plugins/dualGovernance/utils/types";
import { useQuery } from "@tanstack/react-query";
import { PUB_CHAIN } from "@/constants";
import { useQueryClient } from '@tanstack/react-query'

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

export function useProposal(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  autoRefresh = false
) {
  const [proposalCreationEvent, setProposalCreationEvent] =
    useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadata] = useState<string>();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
    queryKey: proposalQueryKey,
  } = useReadContract<typeof OptimisticTokenVotingPluginAbi, "getProposal", any[]>({
    address,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "getProposal",
    args: [proposalId],
    chainId: PUB_CHAIN.id,
  });
  const proposalData = decodeProposalResultData(proposalResult as any);

  useEffect(() => {
    if (autoRefresh) proposalRefetch()
  }, [blockNumber])

  // Creation event
  useEffect(() => {
    if (!proposalData) return;
    publicClient
      .getLogs({
        address,
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
        setMetadata(log.args.metadata);
      })
      .catch((err) => {
        console.error("Could not fetch the proposal defailt", err);
        return null;
      });
  }, [proposalData?.vetoTally]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    isSuccess: metadataReady,
    error: metadataError,
  } = useQuery<ProposalMetadata, Error>({
    queryKey: [`dualGovernanceProposal-${address}-${proposalId}`, metadataUri!],
    queryFn: () => metadataUri ? fetchJsonFromIpfs(metadataUri) : Promise.resolve(null),
    enabled: !!metadataUri
  });

  const proposal = arrangeProposalData(
    proposalData,
    proposalCreationEvent,
    metadataContent
  );

  return {
    proposal,
    status: {
      proposalReady: proposalFetchStatus === "idle",
      proposalLoading: proposalFetchStatus === "fetching",
      proposalError,
      metadataReady,
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
