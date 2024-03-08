import { useEffect } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useRouter } from "next/router";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/dualGovernance/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/dualGovernance/hooks/useUserCanVeto";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useProposalVeto(proposalId: string) {
  const { reload } = useRouter();
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const { proposal, status: proposalFetchStatus } = useProposal(
    proposalId,
    true
  );
  const vetoes = useProposalVetoes(
    publicClient!,
    PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    proposalId,
    proposal
  );
  const canVeto = useUserCanVeto(BigInt(proposalId)) as boolean;

  const { addAlert } = useAlertContext() as AlertContextProps;
  const {
    writeContract: vetoWrite,
    data: vetoTxHash,
    error: vetoingError,
    status: vetoingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: vetoTxHash });

  useEffect(() => {
    if (vetoingStatus === "idle" || vetoingStatus === "pending") return;
    else if (vetoingStatus === "error") {
      if (vetoingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
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
    reload();
  }, [vetoingStatus, vetoTxHash, isConfirming, isConfirmed]);

  const vetoProposal = () => {
    vetoWrite({
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
      functionName: "veto",
      args: [proposalId],
    });
  };

  return {
    proposal,
    proposalFetchStatus,
    vetoes,
    canVeto,
    isConfirming: vetoingStatus === "pending" || isConfirming,
    isConfirmed,
    vetoProposal,
  };
}
