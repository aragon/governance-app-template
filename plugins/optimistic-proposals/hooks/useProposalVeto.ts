import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/optimistic-proposals/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/optimistic-proposals/hooks/useUserCanVeto";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/optimistic-proposals/artifacts/OptimisticTokenVotingPlugin.sol";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useProposalId } from "./useProposalId";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useProposalVeto(index: number) {
  const { proposalId } = useProposalId(index);
  const { proposal, status: proposalFetchStatus, refetch: refetchProposal } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(proposalId);
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(proposalId);

  const {
    writeContract,
    status: vetoingStatus,
    isConfirming,
    isConfirmed,
  } = useTransactionManager({
    onSuccessMessage: "Veto registered",
    onSuccess() {
      refetchCanVeto();
      refetchProposal();
    },
    onErrorMessage: "Could not submit the veto",
  });

  const vetoProposal = () => {
    writeContract({
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
      functionName: "veto",
      args: [proposalId ?? BigInt(0)],
    });
  };

  return {
    proposal,
    proposalFetchStatus,
    vetoes,
    canVeto: !!canVeto,
    isConfirming: vetoingStatus === "pending" || isConfirming,
    isConfirmed,
    vetoProposal,
  };
}
