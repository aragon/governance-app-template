import { useState, useEffect } from "react";
import { Proposal } from "@/plugins/lockToVote/utils/types";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.vetoTally >= proposal?.parameters?.minVetoVotingPower
        ? { variant: "success", label: "Executable" }
        : proposal?.active
          ? { variant: "primary", label: "Active" }
          : proposal?.executed
            ? { variant: "success", label: "Executed" }
            : { variant: "critical", label: "Defeated" }
    );
  }, [proposal?.vetoTally, proposal?.active, proposal?.executed, proposal?.parameters?.minVetoVotingPower]);

  return status;
};
