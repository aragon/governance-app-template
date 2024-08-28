import { useEffect, useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { EmergencyMultisigPluginAbi } from "../artifacts/EmergencyMultisigPlugin";
import { toHex } from "viem";
import { useProposal } from "./useProposal";
import { getContentCid, uploadToPinata } from "@/utils/ipfs";

export function useProposalExecute(proposalId: string) {
  const { push } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;
  const [isExecuting, setIsExecuting] = useState(false);
  const {
    rawPrivateData: { privateRawMetadata },
    proposal,
  } = useProposal(proposalId);

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
    abi: EmergencyMultisigPluginAbi,
    chainId: PUB_CHAIN.id,
    functionName: "canExecute",
    args: [BigInt(proposalId)],
  });
  const {
    writeContract: executeWrite,
    data: executeTxHash,
    error: executingError,
    status: executingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: executeTxHash });

  const executeProposal = () => {
    let actualMetadataUri: string;

    if (!canExecute) return;
    else if (!privateRawMetadata || !proposal?.actions) return;

    setIsExecuting(true);

    return uploadToPinata(privateRawMetadata)
      .then((uri) => {
        actualMetadataUri = uri;

        return getContentCid(privateRawMetadata);
      })
      .then((expectedMetadataUri) => {
        if (actualMetadataUri != expectedMetadataUri) {
          throw new Error("The uploaded metadata URI doesn't match");
        }

        executeWrite({
          chainId: PUB_CHAIN.id,
          abi: EmergencyMultisigPluginAbi,
          address: PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
          functionName: "execute",
          args: [BigInt(proposalId), toHex(expectedMetadataUri), proposal.actions],
        });
      })
      .catch((err) => {
        console.error(err);
        setIsExecuting(false);
        addAlert("Could not recover the details to execute the transaction");
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

    setTimeout(() => {
      push("#/");
      window.scroll(0, 0);
    }, 1000 * 2);
  }, [executingStatus, executeTxHash, isConfirming, isConfirmed]);

  return {
    executeProposal,
    canExecute:
      !isCanVoteError &&
      !isCanVoteLoading &&
      !isConfirmed &&
      !!canExecute &&
      !!privateRawMetadata &&
      !!proposal?.actions,
    isConfirming: isExecuting || isConfirming,
    isConfirmed,
  };
}
