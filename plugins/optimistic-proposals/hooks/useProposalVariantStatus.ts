import { useState, useEffect } from "react";
import { OptimisticProposal } from "@/plugins/optimistic-proposals/utils/types";
import { ProposalStatus } from "@aragon/ods";
import { useToken } from "./useToken";
import { PUB_BRIDGE_ADDRESS } from "@/constants";
import { useTokenPastVotes } from "./useTokenPastVotes";

export const useProposalVariantStatus = (proposal: OptimisticProposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });
  const { tokenSupply: totalSupply } = useToken();
  const { votes: bridgedBalance } = useTokenPastVotes(
    PUB_BRIDGE_ADDRESS,
    proposal?.parameters.snapshotTimestamp || BigInt(0)
  );

  useEffect(() => {
    if (!proposal || !proposal?.parameters || !totalSupply || typeof bridgedBalance === "undefined") return;

    const effectiveSupply = proposal.parameters.skipL2 ? totalSupply - bridgedBalance : totalSupply;
    const minVetoVotingPower = (effectiveSupply * BigInt(proposal.parameters.minVetoRatio)) / BigInt(1_000_000);

    setStatus(
      proposal?.vetoTally >= minVetoVotingPower
        ? { variant: "critical", label: "Defeated" }
        : proposal?.active
          ? { variant: "info", label: "Active" }
          : proposal?.executed
            ? { variant: "primary", label: "Executed" }
            : { variant: "success", label: "Executable" }
    );
  }, [
    proposal?.vetoTally,
    proposal?.active,
    proposal?.executed,
    proposal?.parameters?.minVetoRatio,
    totalSupply,
    bridgedBalance,
  ]);

  return status;
};

export const useProposalStatus = (proposal: OptimisticProposal) => {
  const [status, setStatus] = useState<ProposalStatus>();
  const { tokenSupply: totalSupply } = useToken();
  const { votes: bridgedBalance } = useTokenPastVotes(
    PUB_BRIDGE_ADDRESS,
    proposal?.parameters.snapshotTimestamp || BigInt(0)
  );

  useEffect(() => {
    if (!proposal || !proposal?.parameters || !totalSupply || typeof bridgedBalance === "undefined") return;

    const effectiveSupply = proposal.parameters.skipL2 ? totalSupply - bridgedBalance : totalSupply;
    const minVetoVotingPower = (effectiveSupply * BigInt(proposal.parameters.minVetoRatio)) / BigInt(1_000_000);

    setStatus(
      proposal?.vetoTally >= minVetoVotingPower
        ? ProposalStatus.VETOED
        : proposal?.active
          ? ProposalStatus.ACTIVE
          : proposal?.executed
            ? ProposalStatus.EXECUTED
            : ProposalStatus.ACCEPTED
    );
  }, [
    proposal?.vetoTally,
    proposal?.active,
    proposal?.executed,
    proposal?.parameters?.minVetoRatio,
    totalSupply,
    bridgedBalance,
  ]);

  return status;
};
