import { useState, useEffect } from "react";
import { getEid } from "../utils/layer-zero";
import { getMessagesBySrcTxHash, Message, MessageStatus } from "@layerzerolabs/scan-client";
import { ChainName, isTestnet } from "@/utils/chains";
import { AlertContextProps, useAlerts } from "@/context/Alerts";

function layerZeroScanURL(chainName: ChainName) {
  return isTestnet(chainName) ? `https://testnet.layerzeroscan.com` : `https://layerzeroscan.com`;
}

export function useCrossChainTransaction(srcTx: `0x${string}` | undefined, srcChainName: ChainName) {
  const [message, setMessage] = useState<Message | null>(null);
  const [scanUrl, setScanUrl] = useState("");
  useCrossChainNotifications({ message, scanUrl });
  const srcEid = getEid(srcChainName);

  useEffect(() => {
    if (!srcTx || !srcEid) return;

    const fetchMessage = async () => {
      try {
        const { messages } = await getMessagesBySrcTxHash(srcEid, srcTx);
        if (messages.length > 0) {
          const msg = messages[0];
          setMessage(msg);
          setScanUrl(`${layerZeroScanURL(srcChainName)}/tx/${srcTx}`);
        }
      } catch (error) {
        console.error("Error fetching cross-chain message:", error);
      }
    };

    fetchMessage();
    const intervalId = setInterval(fetchMessage, 3000); // Poll every 3 seconds

    if (message?.dstTxHash) clearInterval(intervalId); // Stop polling if message has been delivered

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [srcTx, srcEid, srcChainName]);

  return { message, scanUrl };
}

export function useCrossChainNotifications({ message, scanUrl }: { message: Message | null; scanUrl: string }) {
  const { addAlert } = useAlerts() as AlertContextProps;
  useEffect(() => {
    if (!message || !scanUrl) return;

    if (message.status === MessageStatus.INFLIGHT) {
      addAlert("Cross Chain Message in Flight", {
        type: "info",
        timeout: 6 * 1000,
        explorerLinkOverride: scanUrl,
      });
      return;
    }

    // success
    if (message.status === MessageStatus.DELIVERED) {
      addAlert("Crosschain message delivered", {
        type: "success",
        description: "The transaction has been validated on the destination chain",
        explorerLinkOverride: scanUrl,
        timeout: 10 * 1000,
      });
      return;
    }

    if (message.status === MessageStatus.FAILED) {
      addAlert("Crosschain message unsuccessful", {
        description: "There was an error in the crosschain message",
        type: "error",
        explorerLinkOverride: scanUrl,
        timeout: 10 * 1000,
      });
      return;
    }
  }, [message, scanUrl]);
}
