import { useState } from "react";
import { useReadContract } from "wagmi";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useProposalExecute(proposalIdx: number) {
  const { reload } = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: LockToVetoPluginAbi,
    chainId: PUB_CHAIN.id,
    functionName: "canExecute",
    args: [BigInt(proposalIdx)],
  });

  const { writeContract, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Proposal executed",
    onSuccess() {
      setTimeout(() => reload(), 1000 * 2);
    },
    onErrorMessage: "Could not execute the proposal",
    onErrorDescription: "The proposal may contain actions with invalid operations",
    onError() {
      setIsExecuting(false);
    },
  });

  const executeProposal = () => {
    if (!canExecute) return;
    else if (typeof proposalIdx === "undefined") return;

    setIsExecuting(true);

    writeContract({
      chainId: PUB_CHAIN.id,
      abi: LockToVetoPluginAbi,
      address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
      functionName: "execute",
      args: [BigInt(proposalIdx)],
    });
  };

  return {
    executeProposal,
    canExecute: !isCanVoteError && !isCanVoteLoading && !isConfirmed && !!canExecute,
    isConfirming: isExecuting || isConfirming,
    isConfirmed,
  };
}
