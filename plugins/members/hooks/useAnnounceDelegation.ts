import { DelegateAnnouncerAbi } from "../artifacts/DelegationWall.sol";
import { PUB_DELEGATION_WALL_CONTRACT_ADDRESS } from "@/constants";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex } from "viem";
import { useAlerts } from "@/context/Alerts";
import { uploadToPinata } from "@/utils/ipfs";
import { useCallback, useEffect, useState } from "react";
import { type IAnnouncementMetadata } from "../utils/types";
import { useDelegates } from "./useDelegates";

export function useAnnounceDelegation(onSuccess?: () => void) {
  const { addAlert } = useAlerts();
  const { writeContract, data: hash, error, status } = useWriteContract();
  const { refetch } = useDelegates();
  const [uploading, setUploading] = useState(false);
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (status === "idle" || status === "pending") return;
    else if (status === "error") {
      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("The transaction signature was declined", {
          description: "Nothing will be sent to the network",
          timeout: 4 * 1000,
        });
      } else {
        console.error("Could not create delegate profile", error);
        addAlert("Could not create your delegate profile", { type: "error" });
      }
      return;
    }

    // success
    if (!hash) return;
    else if (isConfirming) {
      addAlert("Delegate profile submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: hash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Delegate profile registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: hash,
    });

    // Force a refresh of the delegates list
    refetch();

    onSuccess?.();
  }, [status, hash, isConfirming, isConfirmed]);

  const announceDelegation = useCallback(
    async (metadata: IAnnouncementMetadata) => {
      if (!metadata) return;

      setUploading(true);

      try {
        const ipfsUrl = await uploadToPinata(JSON.stringify(metadata));

        if (!ipfsUrl) throw new Error("Empty IPFS URL");
        setTimeout(() => setUploading(false), 1000);

        writeContract({
          abi: DelegateAnnouncerAbi,
          address: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
          functionName: "register",
          args: [toHex(ipfsUrl)],
        });
      } catch (error) {
        setUploading(false);

        addAlert("Could not upload the details", {
          description: "The profile details could not be pinned on IPFS",
          type: "error",
        });

        console.error("Could not upload delegate profile metadata to IPFS", error);
      }
    },
    [writeContract]
  );

  return {
    announceDelegation,
    isConfirmed,
    isConfirming: uploading || isConfirming,
    status,
  };
}
