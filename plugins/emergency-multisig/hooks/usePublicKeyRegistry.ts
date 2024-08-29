import { useState } from "react";
import { Hex } from "viem";
import { PublicKeyRegistryAbi } from "../artifacts/PublicKeyRegistry";
import { useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { PUB_PUBLIC_KEY_REGISTRY_CONTRACT_ADDRESS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { uint8ArrayToHex } from "@/utils/hex";
import { useDerivedWallet } from "../../../hooks/useDerivedWallet";
import { debounce } from "@/utils/debounce";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function usePublicKeyRegistry() {
  const config = useConfig();
  const [isRegistering, setIsRegistering] = useState(false);
  const { publicKey, requestSignature } = useDerivedWallet();

  const { writeContract, isConfirming } = useTransactionManager({
    onSuccessMessage: "Public key registered",
    onSuccess() {
      setTimeout(() => refetch(), 1000 * 2);
    },
    onErrorMessage: "Could not register the public key",
    onError() {
      // Refetch the status, just in case
      debounce(() => refetch(), 800);
      setIsRegistering(false);
    },
  });

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

  return {
    data: data || [],
    registerPublicKey,
    isLoading,
    isConfirming: isRegistering || isConfirming,
    error,
  };
}
