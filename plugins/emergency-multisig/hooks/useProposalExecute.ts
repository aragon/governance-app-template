import { useState } from "react";
import { useReadContract } from "wagmi";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { EmergencyMultisigPluginAbi } from "../artifacts/EmergencyMultisigPlugin";
import { toHex } from "viem";
import { useProposal } from "./useProposal";
import { getContentCid, uploadToPinata } from "@/utils/ipfs";
import { useTransactionManager } from "@/hooks/useTransactionManager";

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

  const { writeContract, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Proposal executed",
    onSuccess() {
      setTimeout(() => {
        push("#/");
        window.scroll(0, 0);
      }, 1000 * 2);
    },
    onErrorMessage: "Could not execute the proposal",
    onErrorDescription: "The proposal may contain actions with invalid operations",
    onError() {
      setIsExecuting(false);
    },
  });

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

        writeContract({
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
