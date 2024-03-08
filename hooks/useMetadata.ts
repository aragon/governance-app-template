import { fetchJsonFromIpfs } from "@/utils/ipfs";
import { useQuery } from "@tanstack/react-query";
import { fromHex } from "viem";

type JsonValue = string | number | boolean;
type JsonObject = JsonValue | Record<string, JsonValue> | Array<JsonValue>;

export function useMetadata<T = JsonObject>(ipfsUri?: string) {
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
