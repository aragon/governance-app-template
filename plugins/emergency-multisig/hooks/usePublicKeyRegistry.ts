import { useEffect, useState } from "react";
import { Hex } from "viem";
import { PublicKeyRegistryAbi } from "../artifacts/PublicKeyRegistry";
import { useConfig, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { uint8ArrayToHex } from "@/utils/hex";
import { useDerivedWallet } from "../../../hooks/useDerivedWallet";
import { useAlerts } from "@/context/Alerts";
import { debounce } from "@/utils/debounce";

export function usePublicKeyRegistry() {
  const config = useConfig();
  const { addAlert } = useAlerts();
  const [isRegistering, setIsRegistering] = useState(false);
  const { writeContract, status: registrationStatus, data: createTxHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: createTxHash });
  const { publicKey, requestSignature } = useDerivedWallet();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["public-key-registry-items-fetching", PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS],
    queryFn: () => {
      return readContract(config, {
        abi: PublicKeyRegistryAbi,
        address: PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS,
        functionName: "getRegisteredWallets",
      }).then((addresses) => {
        return Promise.all(
          addresses.map((address) => {
            return readContract(config, {
              abi: PublicKeyRegistryAbi,
              address: PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS,
              functionName: "publicKeys",
              args: [address],
            }).then((publicKey: Hex) => {
              // zip values
              return { address, publicKey };
            });
          })
        );
      });
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: 1000 * 60 * 5,
  });

  const registerPublicKey = async () => {
    setIsRegistering(true);

    try {
      let pubK: Uint8Array | undefined = publicKey;
      if (!pubK) {
        const keys = await requestSignature();
        pubK = keys.publicKey;
      }

      writeContract({
        abi: PublicKeyRegistryAbi,
        address: PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS,
        functionName: "setPublicKey",
        args: [uint8ArrayToHex(pubK)],
      });
    } catch (err) {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    if (registrationStatus === "idle" || registrationStatus === "pending") return;
    else if (registrationStatus === "error") {
      // Refetch the status, just in case
      debounce(() => refetch(), 800);

      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("The transaction signature was declined", {
          description: "Nothing will be sent to the network",
          timeout: 4 * 1000,
        });
      } else {
        console.error(error);
        addAlert("Could not register the public key", { type: "error" });
      }
      setIsRegistering(false);
      return;
    }

    // success
    if (!createTxHash) return;
    else if (isConfirming) {
      addAlert("Transaction submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: createTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Public key registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: createTxHash,
    });
    setTimeout(() => refetch(), 1000 * 2);
  }, [registrationStatus, createTxHash, isConfirming, isConfirmed]);

  return {
    data: data || [],
    registerPublicKey,
    isLoading,
    isConfirming: isRegistering || isConfirming,
    error,
  };
}
