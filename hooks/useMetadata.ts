import { fetchJsonFromIpfs } from "@/utils/ipfs";
import { JsonValue } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { fromHex } from "viem";

export function useMetadata<T = JsonValue>(ipfsUri?: string) {
  const { data, isLoading, isSuccess, error } = useQuery<T, Error>({
    queryKey: [ipfsUri || ""],
    queryFn: () => {
      if (!ipfsUri || !fromHex(ipfsUri as any, "string")) {
        return Promise.resolve("");
      }
      return fetchJsonFromIpfs(ipfsUri);
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
}
