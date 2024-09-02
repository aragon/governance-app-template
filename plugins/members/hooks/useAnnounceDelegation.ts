import { DelegateAnnouncerAbi } from "../artifacts/DelegationWall.sol";
import { PUB_DELEGATION_WALL_CONTRACT_ADDRESS } from "@/constants";
import { toHex } from "viem";
import { useAlerts } from "@/context/Alerts";
import { uploadToPinata } from "@/utils/ipfs";
import { useCallback, useState } from "react";
import { type IAnnouncementMetadata } from "../utils/types";
import { useDelegates } from "./useDelegates";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useAnnounceDelegation(onSuccess?: () => void) {
  const { addAlert } = useAlerts();
  const { refetch } = useDelegates();
  const [uploading, setUploading] = useState(false);

  const { writeContract, status, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Delegate profile registered",
    onSuccess() {
      // Force a refresh of the delegates list
      refetch();
      onSuccess?.();
    },
    onErrorMessage: "Could not create your delegate profile",
  });

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
