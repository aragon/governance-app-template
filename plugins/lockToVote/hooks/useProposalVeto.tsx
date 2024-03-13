import { useEffect } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/lockToVote/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/lockToVote/hooks/useUserCanVeto";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/lockToVote/artifacts/OptimisticTokenVotingPlugin.sol";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";

export function useProposalVeto(proposalId: string) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const {
    proposal,
    status: proposalFetchStatus,
    refetch: refetchProposal,
  } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(
    publicClient!,
    PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    proposalId,
    proposal
  );

  const { addAlert } = useAlertContext() as AlertContextProps;
  const {
    writeContract: vetoWrite,
    data: vetoTxHash,
    error: vetoingError,
    status: vetoingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: vetoTxHash });
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(
    BigInt(proposalId)
  );

  useEffect(() => {
    if (vetoingStatus === "idle" || vetoingStatus === "pending") return;
    else if (vetoingStatus === "error") {
      if (vetoingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        addAlert("Could not create the veto", { type: "error" });
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
      abi: LockToVetoPluginAbi,
      address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
      functionName: "veto",
      args: [proposalId, 50000000000000000000],
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
