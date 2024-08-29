import { useState, useEffect } from "react";
import { Proposal } from "@/plugins/lockToVote/utils/types";
import { ProposalStatus } from "@aragon/ods";
import { useToken } from "./useToken";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });
  const { tokenSupply: totalSupply } = useToken();

  useEffect(() => {
    if (!proposal || !proposal?.parameters || !totalSupply) return;

    const minVetoVotingPower = (totalSupply * BigInt(proposal.parameters.minVetoVotingPower)) / BigInt(1_000_000);

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
    proposal?.parameters?.minVetoVotingPower,
    totalSupply,
  ]);

  return status;
};
