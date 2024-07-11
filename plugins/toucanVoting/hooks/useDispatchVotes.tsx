import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PUB_L2_CHAIN, PUB_L2_CHAIN_NAME, PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS } from "@/constants";
import { useEffect } from "react";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { useProposalRef } from "./useProposalRef";
import { useForceL2Chain } from "./useForceChain";
import { getGasForCrossChainOperation } from "../utils/layer-zero";

type LzSendParamsDispatch = {
  gasLimit: bigint;
  options: `0x${string}`;
  fee: {
    nativeFee: bigint;
    lzTokenFee: bigint;
  };
};

export function useDispatchQuote(
  proposalId: number,
  gasLimit = getGasForCrossChainOperation(PUB_L2_CHAIN_NAME, "DISPATCH_VOTES")
) {
  const { proposalRef } = useProposalRef(proposalId);

  const {
    data: lzSendParams,
    isError,
    error,
    isLoading,
  } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    chainId: PUB_L2_CHAIN.id,
    functionName: "quote",
    args: [BigInt(proposalRef ?? 0), gasLimit],
    query: { enabled: !!proposalRef },
  });

  return {
    lzSendParams,
    status: {
      error,
      isLoading,
      isError,
    },
  };
}

export function useDispatchVotes(proposalId: number, lzSendParams: LzSendParamsDispatch | undefined) {
  const { addAlert } = useAlerts() as AlertContextProps;
  const forceL2 = useForceL2Chain();
  const { proposalRef } = useProposalRef(proposalId);
  const {
    writeContract: dispatchWrite,
    data: dispatchTxHash,
    error: dispatchTxError,
    status: dispatchTxStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: dispatchTxHash,
  });

  // Loading status and errors
  useEffect(() => {
    // pending or idle should show nothing
    if (dispatchTxStatus === "idle" || dispatchTxStatus === "pending") return;

    // check the error first
    if (dispatchTxStatus === "error") {
      if (dispatchTxError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(dispatchTxError);
        addAlert("Could not dispatch votes", { type: "error" });
      }
      return;
    }

    // not idle nor pending, and no error, so it must be success
    // if no tx hash, then some intermediate state
    if (!dispatchTxHash || !isConfirmed) return;

    // sent to the mempool
    if (isConfirming) {
      addAlert("Vote dispatch awaiting confirmation", {
        description: "Waiting for the transaction to be validated",
        txHash: dispatchTxHash,
      });
      return;
    }

    // final state: success
    addAlert("The message has been accepted by the bridge and will be picked up shortly", {
      description: "The transaction has been validated",
      type: "success",
      txHash: dispatchTxHash,
    });
  }, [dispatchTxStatus, dispatchTxHash, isConfirming, isConfirmed]);

  const dispatchVotes = () => {
    if (!proposalRef || !lzSendParams) {
      console.error("Missing proposal reference or lzSendParams in dispatchVotes");
      return;
    }

    forceL2(() =>
      dispatchWrite({
        abi: ToucanRelayAbi,
        chainId: PUB_L2_CHAIN.id,
        address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
        functionName: "dispatchVotes",
        args: [proposalRef, lzSendParams],
        value: lzSendParams.fee.nativeFee,
      })
    );
  };

  return {
    dispatchVotes,
    dispatchTxHash,
    dispatchTxStatus,
    isConfirming,
    isConfirmed,
  };
}

export function useCanDispatch(proposalId: number) {
  // get the proposal ref
  const { proposalRef } = useProposalRef(proposalId);

  // call can dispatch
  const {
    data: canDispatchResult,
    isLoading,
    isError,
  } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    chainId: PUB_L2_CHAIN.id,
    functionName: "canDispatch",
    args: [BigInt(proposalRef ?? 0)],
    query: { enabled: !!proposalRef },
  });

  return {
    canDispatch: canDispatchResult ? canDispatchResult[0] : false,
    isLoading,
    isError,
  };
}
