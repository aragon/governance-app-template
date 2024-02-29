import { useAlert } from "@/context/AlertContext";
import { useCache } from "@/context/CacheContext";
import { fetchJsonFromIpfs } from "@/utils/ipfs";
import { useEffect } from "react";

type JsonValue = string | number | boolean;
type JsonObject = JsonValue | Record<string, JsonValue> | Array<JsonValue>;

export const useMetadata = (metadataUri?: string) => {
  const { addAlert } = useAlert();

  const {
    value: metadata,
    isPending,
    error,
  } = useCache<JsonObject>(() => {
    if (!metadataUri) return Promise.resolve(null);

    return fetchJsonFromIpfs(metadataUri);
  }, ["metadata", metadataUri ?? ""]);

  useEffect(() => {
    if (!error) return;

    addAlert("Fetch error", {
      description: "Could not fetch the metadata",
      type: "error",
    });
  }, [!!error]);

  return {
    metadata,
    isPending,
    error,
  };
};
