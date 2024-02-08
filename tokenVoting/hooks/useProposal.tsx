import { useState, useEffect } from "react";
import { Address } from "viem";
import { PublicClient, useContractRead } from "wagmi";
import { fetchJsonFromIpfs } from "@/utils/ipfs";
import { getAbiItem } from "viem";
import { TokenVotingAbi } from "@/tokenVoting/artifacts/TokenVoting.sol";
import { Action } from "@/utils/types";
import {
  Proposal,
  ProposalMetadata,
  ProposalParameters,
  Tally,
} from "@/tokenVoting/utils/types";
import { useQuery } from "react-query";

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

export function useProposal(
  publicClient: PublicClient,
  address: Address,
  proposalId: string,
  autoRefresh = false
) {
  const [proposalCreationEvent, setProposalCreationEvent] =
    useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadata] = useState<string>();

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
  } = useContractRead<typeof TokenVotingAbi, "getProposal", any[]>({
    address,
    abi: TokenVotingAbi,
    functionName: "getProposal",
    args: [proposalId],
    watch: autoRefresh,
  });
  const proposalData = decodeProposalResultData(proposalResult);

  // Creation event
  useEffect(() => {
    if (!proposalData) return;

    publicClient
      .getLogs({
        address,
        event: ProposalCreatedEvent,
        args: {
          proposalId: proposalId,
        } as any,
        fromBlock: proposalData.parameters.snapshotBlock,
        toBlock: proposalData.parameters.startDate,
      })
      .then((logs: ProposalCreatedLogResponse[]) => {
        setProposalCreationEvent(logs[0].args);
        setMetadata(logs[0].args.metadata);
      });
  }, [proposalData?.tally]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    isSuccess: metadataReady,
    error: metadataError,
  } = useQuery<ProposalMetadata, Error>(
    `ipfsData:${proposalId}`,
    () =>
      metadataUri ? fetchJsonFromIpfs(metadataUri) : Promise.resolve(null),
    { enabled: !!metadataUri }
  );

  const proposal = arrangeProposalData(
    proposalData,
    proposalCreationEvent,
    metadataContent
  );

  if (proposalId === "1")
    console.log(
      "UseProposal",
      `Status: ${proposalFetchStatus}, meta load: ${metadataLoading}, meta ready ${metadataReady}`
    );

  return {
    proposal,
    status: {
      proposalReady: proposalFetchStatus === "idle",
      proposalLoading: proposalFetchStatus === "fetching",
      proposalError,
      metadataReady,
      metadataLoading,
      metadataError,
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
    tally: data[3] as Tally,
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
    tally: proposalData.tally,
    allowFailureMap: proposalData.allowFailureMap,
    creator: creationEvent?.creator || "",
    title: metadata?.title || "",
    summary: metadata?.summary || "",
    resources: metadata?.resources || [],
  };
}
