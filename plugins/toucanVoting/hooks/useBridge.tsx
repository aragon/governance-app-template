import { OFTAdapterAbi } from "@/plugins/toucanVoting/artifacts/OFTAdapter.sol";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Options, hexZeroPadTo32 } from "@layerzerolabs/lz-v2-utilities";
import { PUB_L2_CHAIN_NAME, PUB_OFT_ADAPTER_ADDRESSS, PUB_TOKEN_L1_ADDRESS } from "@/constants";
import { useEffect } from "react";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { getEid, getLzOptions } from "../utils/layer-zero";

// amount of gas to send with the bridge transaction
const DEFAULT_BRIDGE_GAS_LIMIT = BigInt(100_000);

export function useBridgeQuote(tokensToSend: bigint, gasLimit: bigint = DEFAULT_BRIDGE_GAS_LIMIT) {
  const { address } = useAccount();
  const eid = getEid(PUB_L2_CHAIN_NAME);

  const {
    data: quote,
    isError,
    error,
    isLoading,
  } = useReadContract({
    address: PUB_OFT_ADAPTER_ADDRESSS,
    abi: OFTAdapterAbi,
    functionName: "quoteSend",
    args: [
      {
        dstEid: eid,
        to: hexZeroPadTo32(address!) as `0x${string}`,
        amountLD: tokensToSend,
        minAmountLD: tokensToSend,
        extraOptions: getLzOptions(gasLimit),
        composeMsg: "0x",
        oftCmd: "0x",
      },
      false,
    ],
    query: { enabled: !!address },
  });

  return {
    quote: {
      nativeFee: quote?.nativeFee ?? 0,
    },
    status: {
      error,
      isLoading,
      isError,
    },
  };
}

export function useBridge() {
  const { address } = useAccount();
  const dstEid = getEid(PUB_L2_CHAIN_NAME);
  const { addAlert } = useAlerts() as AlertContextProps;
  const { reload } = useRouter();
  const {
    writeContract: bridgeWrite,
    data: bridgeTxHash,
    error: bridgingError,
    status: bridgingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: bridgeTxHash });

  // Loading status and errors
  useEffect(() => {
    if (bridgingStatus === "idle" || bridgingStatus === "pending") return;
    else if (bridgingStatus === "error") {
      if (bridgingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(bridgingError);
        addAlert("Could not bridge", { type: "error" });
      }
      return;
    }

    // success
    if (!bridgeTxHash) return;
    else if (isConfirming) {
      addAlert("Bridge request submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: bridgeTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Tokens sent for bridging", {
      description: "The transaction has been validated",
      type: "success",
      txHash: bridgeTxHash,
    });

    // reload();
  }, [bridgingStatus, bridgeTxHash, isConfirming, isConfirmed]);

  const bridgeTokens = (tokensToSend: bigint, fee: bigint, gasLimit = DEFAULT_BRIDGE_GAS_LIMIT) => {
    bridgeWrite({
      abi: OFTAdapterAbi,
      address: PUB_OFT_ADAPTER_ADDRESSS,
      functionName: "send",
      args: [
        {
          dstEid,
          to: hexZeroPadTo32(address!) as `0x${string}`,
          amountLD: tokensToSend,
          minAmountLD: tokensToSend,
          extraOptions: getLzOptions(gasLimit),
          composeMsg: "0x",
          oftCmd: "0x",
        },
        {
          nativeFee: fee,
          lzTokenFee: BigInt(0),
        },
        address!,
      ],
      value: fee,
    });
  };

  return {
    bridgeTokens,
    bridgeTxHash,
    bridgingStatus,
    isConfirming,
    isConfirmed,
  };
}
