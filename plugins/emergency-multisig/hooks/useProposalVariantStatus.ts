import { useState, useEffect } from "react";
import { ProposalStatus } from "@aragon/ods";
import dayjs from "dayjs";
import { EmergencyProposal } from "../utils/types";

export const useProposalVariantStatus = (proposal: EmergencyProposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.approvals >= proposal?.parameters?.minApprovals
        ? proposal?.executed
          ? { variant: "success", label: "Executed" }
          : { variant: "success", label: "Executable" }
        : dayjs().isAfter(dayjs(Number(proposal?.parameters.expirationDate) * 1000))
          ? { variant: "critical", label: "Failed" }
          : { variant: "info", label: "Active" }
    );
  }, [proposal, proposal?.approvals, proposal?.executed, proposal?.parameters?.minApprovals]);

  return status;
};

export const useProposalStatus = (proposal: EmergencyProposal) => {
  const [status, setStatus] = useState<ProposalStatus>();

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.approvals >= proposal?.parameters?.minApprovals
        ? proposal?.executed
          ? ProposalStatus.EXECUTED
          : ProposalStatus.ACCEPTED
        : dayjs().isAfter(dayjs(Number(proposal?.parameters.expirationDate) * 1000))
          ? ProposalStatus.FAILED
          : ProposalStatus.ACTIVE
    );
  }, [proposal, proposal?.approvals, proposal?.executed, proposal?.parameters?.minApprovals]);

  return status;
};
