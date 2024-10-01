import { useState, useEffect } from "react";
import { Proposal } from "../utils/types";
import { ProposalStatus } from "@aragon/ods";
import { useToken } from "./useToken";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });
  const { tokenSupply: totalSupply } = useToken();

  useEffect(() => {
    if (!proposal || !proposal?.parameters || !totalSupply) return;
    const minVetoVotingPower = (totalSupply * BigInt(proposal.parameters.minVetoVotingPower)) / BigInt(1_000_000);

    if (proposal?.active) {
      setStatus({ variant: "info", label: "Active" });
    } else if (proposal?.executed) {
      setStatus({ variant: "primary", label: "Executed" });
    } else if (proposal?.vetoTally >= minVetoVotingPower) {
      setStatus({ variant: "critical", label: "Defeated" });
    } else {
      setStatus({ variant: "success", label: "Executable" });
    }
  }, [
    proposal?.vetoTally,
    proposal?.active,
    proposal?.executed,
    proposal?.parameters?.minVetoVotingPower,
    totalSupply,
  ]);

  return status;
};

export const useProposalStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState<ProposalStatus>();
  const { tokenSupply: totalSupply } = useToken();
  useEffect(() => {
    if (!proposal || !proposal?.parameters || !totalSupply) return;

    const minVetoVotingPower = (totalSupply * BigInt(proposal.parameters.minVetoVotingPower)) / BigInt(1_000_000);

    if (proposal?.active) {
      setStatus(ProposalStatus.ACTIVE);
    } else if (proposal?.executed) {
      setStatus(ProposalStatus.EXECUTED);
    } else if (proposal?.vetoTally >= minVetoVotingPower) {
      setStatus(ProposalStatus.VETOED);
    } else {
      setStatus(ProposalStatus.ACCEPTED);
    }
  }, [
    proposal?.vetoTally,
    proposal?.active,
    proposal?.executed,
    proposal?.parameters?.minVetoVotingPower,
    totalSupply,
  ]);

  return status;
};
