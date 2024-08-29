import { useProposal } from "./useProposal";
import { useUserCanApprove } from "./useUserCanApprove";
import { EmergencyMultisigPluginAbi } from "../artifacts/EmergencyMultisigPlugin";
import { PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { useProposalApprovals } from "./useProposalApprovals";
import { useRouter } from "next/router";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useProposalApprove(proposalId: string) {
  const { push } = useRouter();

  const { proposal, status: proposalFetchStatus, refetch: refetchProposal } = useProposal(proposalId, true);
  const { canApprove, refetch: refetchCanApprove } = useUserCanApprove(proposalId);
  const approvals = useProposalApprovals(PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS, proposalId, proposal);

  const { writeContract, status, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Approval registered",
    onSuccess() {
      setTimeout(() => {
        push("#/");
        window.scroll(0, 0);
      }, 1000 * 2);
      refetchCanApprove();
      refetchProposal();
    },
    onErrorMessage: "Could not approve the proposal",
    onErrorDescription: "Check that you were part of the multisig when the proposal was created",
  });

  const approveProposal = () => {
    writeContract({
      abi: EmergencyMultisigPluginAbi,
      address: PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
      functionName: "approve",
      args: [BigInt(proposalId)],
    });
  };

  return {
    proposal,
    proposalFetchStatus,
    approvals,
    canApprove: !!canApprove,
    isConfirming: status === "pending" || isConfirming,
    isConfirmed,
    approveProposal,
  };
}
