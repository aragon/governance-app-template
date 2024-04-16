import { useEffect } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/dualGovernance/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/dualGovernance/hooks/useUserCanVeto";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { useAlerts, AlertContextProps } from "@/context/Alerts";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useProposalVeto(proposalId: string) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const { proposal, status: proposalFetchStatus, refetch: refetchProposal } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(publicClient!, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, proposalId, proposal);

  const { addAlert } = useAlerts() as AlertContextProps;
  const { writeContract: vetoWrite, data: vetoTxHash, error: vetoingError, status: vetoingStatus } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: vetoTxHash });
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(BigInt(proposalId));

  useEffect(() => {
    if (vetoingStatus === "idle" || vetoingStatus === "pending") return;
    else if (vetoingStatus === "error") {
      if (vetoingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(vetoingError);
        addAlert("Could not create the proposal", { type: "error" });
      }
      return;
    }

    // success
    if (!vetoTxHash) return;
    else if (isConfirming) {
      addAlert("Veto submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: vetoTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Veto registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: vetoTxHash,
    });
    refetchCanVeto();
    refetchProposal();
  }, [vetoingStatus, vetoTxHash, isConfirming, isConfirmed]);

  const vetoProposal = () => {
    vetoWrite({
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
      functionName: "veto",
      args: [BigInt(proposalId)],
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
