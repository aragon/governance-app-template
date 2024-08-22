import { fetchIpfsAsJson } from "@/utils/ipfs";
import { JsonValue } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useMetadata<T = JsonValue>(ipfsUri?: string) {
  const { data, isLoading, isSuccess, error } = useQuery<T, Error>({
    queryKey: ["ipfs", ipfsUri || ""],
    queryFn: () => {
      if (!ipfsUri) return Promise.resolve("");

      return fetchIpfsAsJson(ipfsUri);
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

export const useIpfsJsonData = useMetadata;
