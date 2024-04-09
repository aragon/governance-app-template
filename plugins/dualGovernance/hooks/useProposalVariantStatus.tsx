import { useState, useEffect } from "react";
import { Proposal } from "@/plugins/dualGovernance/utils/types";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.vetoTally >= proposal?.parameters?.minVetoVotingPower
        ? { variant: "critical", label: "Defeated" }
        : proposal?.active
          ? { variant: "info", label: "Active" }
          : proposal?.executed
            ? { variant: "primary", label: "Executed" }
            : { variant: "success", label: "Executable" }
    );
  }, [proposal?.vetoTally, proposal?.active, proposal?.executed, proposal?.parameters?.minVetoVotingPower]);

  return status;
};
