import { OFTAdapterAbi } from "@/plugins/toucanVoting/artifacts/OFTAdapter.sol";
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PUB_CHAIN_NAME } from "@/constants";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { OFTBridgeConfig, getEid, getLzOptions, hexPadAddress } from "../utils/layer-zero";
import { getChain } from "@/utils/chains";
import { useEffect } from "react";
import { useForceL1Chain, useForceL2Chain } from "./useForceChain";

export function useBridgeQuote(tokensToSend: bigint, config: OFTBridgeConfig) {
  const { address } = useAccount();

  const {
    data: quote,
    isError,
    error,
    isLoading,
  } = useReadContract({
    chainId: getChain(config.chainName).id,
    address: config.address,
    // this is an OFT so the abi is the same
    abi: OFTAdapterAbi,
    functionName: "quoteSend",
    args: [
      {
        dstEid: config.dstEid,
        to: hexPadAddress(address),
        amountLD: tokensToSend,
        minAmountLD: tokensToSend,
        extraOptions: getLzOptions(config.gasLimit),
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
  const { addAlert } = useAlerts() as AlertContextProps;
  const forceL1 = useForceL1Chain();
  const forceL2 = useForceL2Chain();
  const {
    writeContract: bridgeWrite,
    data: bridgeTxHash,
    error: bridgingError,
    status: bridgingStatus,
    ...rest
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

  const bridgeTokens = (tokensToSend: bigint, fee: bigint, config: OFTBridgeConfig) => {
    const chainId = getChain(config.chainName).id;

    const force = config.chainName === PUB_CHAIN_NAME ? forceL1 : forceL2;

    force(() =>
      bridgeWrite({
        chainId,
        abi: OFTAdapterAbi,
        address: config.address,
        functionName: "send",
        args: [
          {
            dstEid: config.dstEid,
            to: hexPadAddress(address),
            amountLD: tokensToSend,
            minAmountLD: tokensToSend,
            extraOptions: getLzOptions(config.gasLimit),
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
      })
    );
  };
  return {
    bridgeTokens,
    bridgeTxHash,
    bridgingStatus,
    isConfirming,
    isConfirmed,
    ...rest,
  };
}
