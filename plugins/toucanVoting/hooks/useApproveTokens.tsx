import { PUB_CHAIN, PUB_TOKEN_L1_ADDRESS } from "@/constants";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useEffect } from "react";
import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useForceL1Chain } from "./useForceChain";

export function useApproveTokens(token: Address) {
  const { addAlert } = useAlerts() as AlertContextProps;
  const forceL1 = useForceL1Chain();
  const {
    writeContract: approveWrite,
    data: approveTxHash,
    error: approveError,
    status: approveStatus,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    queryKey,
  } = useWaitForTransactionReceipt({ hash: approveTxHash });

  useEffect(() => {
    if (approveStatus === "idle" || approveStatus === "pending") return;
    else if (approveStatus === "error") {
      if (approveError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(approveError);
        addAlert("Could not approve tokens", { type: "error" });
      }
      return;
    }

    // success
    if (!approveTxHash) return;
    else if (isConfirming) {
      addAlert("Token Approval submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: approveTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Token approval success", {
      description: "The transaction has been validated",
      type: "success",
      txHash: approveTxHash,
    });
  }, [approveStatus, approveTxHash, isConfirming, isConfirmed]);

  const approveTokens = (amount: bigint, spender: Address) => {
    forceL1(() =>
      approveWrite({
        chainId: PUB_CHAIN.id,
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      })
    );
  };
  return {
    queryKey,
    approveTokens,
    approveStatus,
    isConfirming,
    isConfirmed,
  };
}

export function useAllowance(token: Address, spender: Address) {
  const { address, isConnected } = useAccount();

  const {
    data: allowance,
    error,
    isError,
    isLoading,
    queryKey,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x", spender],
    query: { enabled: isConnected && !!address },
  });

  return {
    allowance,
    status: {
      error,
      isLoading,
      isError,
    },
    queryKey,
  };
}
