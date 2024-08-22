import { useEffect, useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "../artifacts/OptimisticTokenVotingPlugin.sol";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";
import { useProposalId } from "./useProposalId";

export function useProposalExecute(index: number) {
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;
  const { proposalId } = useProposalId(index);
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    chainId: PUB_CHAIN.id,
    functionName: "canExecute",
    args: [proposalId ?? BigInt("0")],
  });
  const {
    writeContract: executeWrite,
    data: executeTxHash,
    error: executingError,
    status: executingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: executeTxHash });

  const executeProposal = () => {
    if (!canExecute) return;
    else if (typeof proposalId === "undefined") return;

    setIsExecuting(true);

    executeWrite({
      chainId: PUB_CHAIN.id,
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
      functionName: "execute",
      args: [BigInt(proposalId)],
    });
  };

  useEffect(() => {
    if (executingStatus === "idle" || executingStatus === "pending") return;
    else if (executingStatus === "error") {
      if (executingError?.message?.startsWith("User rejected the request")) {
        addAlert("The transaction signature was declined", {
          description: "Nothing will be sent to the network",
          timeout: 4 * 1000,
        });
      } else {
        console.error(executingError);
        addAlert("Could not execute the proposal", {
          type: "error",
          description: "The proposal may contain actions with invalid operations",
        });
      }
      setIsExecuting(false);
      return;
    }

    // success
    if (!executeTxHash) return;
    else if (isConfirming) {
      addAlert("Transaction submitted", {
        description: "Waiting for the transaction to be validated",
        type: "info",
        txHash: executeTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Proposal executed", {
      description: "The transaction has been validated",
      type: "success",
      txHash: executeTxHash,
    });

    setTimeout(() => reload(), 1000 * 2);
  }, [executingStatus, executeTxHash, isConfirming, isConfirmed]);

  return {
    executeProposal,
    canExecute: !isCanVoteError && !isCanVoteLoading && !isConfirmed && !!canExecute,
    isConfirming: isExecuting || isConfirming,
    isConfirmed,
  };
}
