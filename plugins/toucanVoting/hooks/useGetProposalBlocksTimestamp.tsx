import { useProposal } from "./useProposal";
import { usePublicClient } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { getBlockNumberAtTimestamp } from "../utils/blockAtTimestamp";

export function useGetProposalBlocksTimestamp(proposalId: string, chainId: number) {
  const client = usePublicClient({ chainId });
  const { proposal } = useProposal(proposalId, true);
  const [timestampSnapshotBlock, setTimestampSnapshotBlock] = useState<bigint>(0n);
  const [endDateBlock, setEndDateBlock] = useState<bigint>(0n);

  const getProposalBlocks = useCallback(async () => {
    if (!proposal || !client) return;

    const [start, end] = await Promise.all([
      getBlockNumberAtTimestamp(proposal.parameters.snapshotTimestamp, client),
      getBlockNumberAtTimestamp(proposal.parameters.endDate, client),
    ]);

    setTimestampSnapshotBlock(start);
    setEndDateBlock(end);

    return [start, end];
  }, [proposal, client]);

  useEffect(() => {
    if (proposal && client) {
      getProposalBlocks();
    }
  }, [proposal, client, getProposalBlocks]);

  return { timestampSnapshotBlock, endDateBlock };
}
