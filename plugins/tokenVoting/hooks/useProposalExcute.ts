import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TokenVotingAbi } from "../artifacts/TokenVoting.sol";
import { AlertContextProps, useAlertContext } from "@/context/AlertContext";
import { useRouter } from "next/router";
import { Proposal } from "../utils/types";
import { useProposal } from "./useProposal";
import { ProposalStatus } from "@/plugins/dualGovernance/utils/types";
import { PUB_CHAIN, PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";

export function useProposalExecute(proposalId: string) {
  const { reload } = useRouter();
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { proposal } = useProposal(proposalId);

  const {
    writeContract: executeWrite,
    data: executeTxHash,
    error: executingError,
    status: executingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: executeTxHash });

  const executeProposal = () => {
    executeWrite({
      chainId: PUB_CHAIN.id,
      abi: TokenVotingAbi,
      address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
      functionName: "execute",
      args: [proposalId],
    });
  };

  useEffect(() => {
    if (executingStatus === "idle" || executingStatus === "pending") return;
    else if (executingStatus === "error") {
      if (executingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(executingError);
        addAlert("Could not execute the proposal", {
          type: "error",
          description:
            "The proposal may contain actions with invalid operations",
        });
      }
      return;
    }

    // success
    if (!executeTxHash) return;
    else if (isConfirming) {
      addAlert("Proposal submitted", {
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
    canExecute: getProposalStatus(proposal) === "Executable",
    isConfirming,
    isConfirmed,
  };
}

function getProposalStatus(proposal: Proposal | null): ProposalStatus {
  // TODO: PENDING
  if (!proposal) return "" as any;
  else if (proposal.executed) return "Executed";
  else if (proposal?.tally.no >= proposal?.parameters?.supportThreshold)
    return "Defeated";
  else if (proposal.active) return "Active";

  return "Executable";
}
