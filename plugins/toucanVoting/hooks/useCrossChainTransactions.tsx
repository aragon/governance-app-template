import { useState, useEffect } from "react";
import { getEid } from "../utils/layer-zero";
import { getMessagesBySrcTxHash, Message } from "@layerzerolabs/scan-client";
import { ChainName, isTestnet } from "@/utils/chains";

function layerZeroScanURL(chainName: ChainName) {
  return isTestnet(chainName) ? `https://testnet.layerzeroscan.com` : `https://layerzeroscan.com`;
}

export function useCrossChainTransaction(srcTx: `0x${string}` | undefined, srcChainName: ChainName) {
  const [message, setMessage] = useState<Message | null>(null);
  const [scanUrl, setScanUrl] = useState("");
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
