import { useEffect } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";

export function useProposalClaimLock(proposalId: string) {
  const { reload } = useRouter();
  const account = useAccount();
  const { addAlert } = useAlerts() as AlertContextProps;

  const {
    data: hasClaimed,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: LockToVetoPluginAbi,
    chainId: PUB_CHAIN.id,
    functionName: "hasClaimedLock",
    args: [BigInt(proposalId), account.address!],
    query: {
      enabled: !!account.address,
    },
  });
  const {
    writeContract: claimLockWrite,
    data: executeTxHash,
    error: executingError,
    status: claimingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: executeTxHash });

  const claimLockProposal = () => {
    if (hasClaimed) return;

    console.log(proposalId, account.address);
    claimLockWrite({
      chainId: PUB_CHAIN.id,
      abi: LockToVetoPluginAbi,
      address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
      functionName: "claimLock",
      args: [BigInt(proposalId), account.address!],
    });
  };

  useEffect(() => {
    if (claimingStatus === "idle" || claimingStatus === "pending") return;
    else if (claimingStatus === "error") {
      if (executingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(executingError);
        addAlert("Could not claim locked tokens", {
          type: "error",
          description: "The proposal may contain actions with invalid operations. Please get in contact with us.",
        });
      }
      return;
    }

    // success
    if (!executeTxHash) return;
    else if (isConfirming) {
      addAlert("Claim submitted", {
        description: "Waiting for the transaction to be validated",
        type: "info",
        txHash: executeTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Claim executed", {
      description: "The transaction has been validated",
      type: "success",
      txHash: executeTxHash,
    });

    setTimeout(() => reload(), 1000 * 2);
  }, [claimingStatus, executeTxHash, isConfirming, isConfirmed]);

  return {
    claimLockProposal,
    hasClaimed: !!hasClaimed,
    isConfirming,
    isConfirmed,
  };
}
