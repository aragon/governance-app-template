import { useState, useEffect } from "react";
import { Proposal } from "@/plugins/toucanVoting/utils/types";
import { ProposalStatus } from "@aragon/ods";
import dayjs from "dayjs";

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: "", label: "" });

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.tally?.yes >= proposal?.parameters?.supportThreshold
        ? proposal?.executed
          ? { variant: "success", label: "Executed" }
          : { variant: "success", label: "Executable" }
        : dayjs().isAfter(dayjs(Number(proposal?.parameters.endDate) * 1000))
          ? { variant: "critical", label: "Failed" }
          : { variant: "info", label: "Active" }
    );
  }, [proposal, proposal?.tally, proposal?.executed, proposal?.parameters?.supportThreshold]);

  return status;
};

export const useProposalStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState<ProposalStatus>();
  const tallySum = proposal?.tally?.yes + proposal?.tally?.no + proposal?.tally?.abstain;

  useEffect(() => {
    if (!proposal || !proposal?.parameters) return;
    setStatus(
      proposal?.tally.yes >= proposal?.parameters?.supportThreshold
        ? proposal?.executed
          ? "executed"
          : "accepted"
        : dayjs().isAfter(dayjs(Number(proposal?.parameters.endDate) * 1000))
          ? "failed"
          : "active"
    );
  }, [proposal, proposal?.tally, proposal?.executed, proposal?.parameters?.supportThreshold]);

  return status;
};
