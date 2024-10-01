import { useState, useEffect } from "react";
import { EmergencyProposal } from "@/plugins/emergency-multisig/utils/types";
import { ProposalStatus } from "@aragon/ods";

export const useProposalVariantStatus = (proposal: EmergencyProposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    if (proposal?.executed) {
      setStatus({ variant: "primary", label: "Executed" });
    } else if (Math.floor(Date.now() / 1000) >= proposal.parameters.expirationDate) {
      if (proposal.approvals < proposal.parameters.minApprovals) {
        setStatus({ variant: "critical", label: "Defeated" });
      } else {
        setStatus({ variant: "critical", label: "Expired" });
      }
    } else if (proposal.approvals >= proposal.parameters.minApprovals) {
      setStatus({ variant: "success", label: "Executable" });
    } else {
      setStatus({ variant: "info", label: "Active" });
    }
  }, [proposal, proposal?.approvals, proposal?.executed, proposal?.parameters?.minApprovals]);

  return status;
};

export const useProposalStatus = (proposal: EmergencyProposal) => {
  const [status, setStatus] = useState<ProposalStatus>();

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;

    if (proposal?.executed) {
      setStatus(ProposalStatus.EXECUTED);
    } else if (Math.floor(Date.now() / 1000) >= proposal.parameters.expirationDate) {
      if (proposal.approvals < proposal.parameters.minApprovals) {
        setStatus(ProposalStatus.REJECTED);
      } else {
        setStatus(ProposalStatus.EXPIRED);
      }
    } else if (proposal.approvals >= proposal.parameters.minApprovals) {
      setStatus(ProposalStatus.EXECUTABLE);
    } else {
      setStatus(ProposalStatus.ACTIVE);
    }
  }, [proposal, proposal?.approvals, proposal?.executed, proposal?.parameters?.minApprovals]);

  return status;
};
