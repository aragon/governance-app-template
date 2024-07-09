import { OFTAdapterAbi } from "@/plugins/toucanVoting/artifacts/OFTAdapter.sol";
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  PUB_CHAIN,
  PUB_CHAIN_NAME,
  PUB_L2_CHAIN_NAME,
  PUB_OFT_ADAPTER_ADDRESSS,
  PUB_TOKEN_L1_ADDRESS,
} from "@/constants";
import { useEffect } from "react";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { getEid, getLzOptions, hexPadAddress } from "../utils/layer-zero";
import { zeroAddress } from "viem";

// amount of gas to send with the bridge transaction
const DEFAULT_BRIDGE_GAS_LIMIT = BigInt(250_000);

export function useBridgeQuote(tokensToSend: bigint, gasLimit: bigint = DEFAULT_BRIDGE_GAS_LIMIT) {
  const { address } = useAccount();
  const eid = getEid(PUB_L2_CHAIN_NAME);

  const {
    data: quote,
    isError,
    error,
    isLoading,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_OFT_ADAPTER_ADDRESSS,
    abi: OFTAdapterAbi,
    functionName: "quoteSend",
    args: [
      {
        dstEid: eid,
        to: hexPadAddress(address),
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
  const { switchChain } = useSwitchChain();
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
  }, [bridgingStatus, bridgeTxHash, isConfirming, isConfirmed]);

  const bridgeTokens = (tokensToSend: bigint, fee: bigint, gasLimit = DEFAULT_BRIDGE_GAS_LIMIT) => {
    switchChain({ chainId: PUB_CHAIN.id });

    bridgeWrite({
      chainId: PUB_CHAIN.id,
      abi: OFTAdapterAbi,
      address: PUB_OFT_ADAPTER_ADDRESSS,
      functionName: "send",
      args: [
        {
          dstEid,
          to: hexPadAddress(address),
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
