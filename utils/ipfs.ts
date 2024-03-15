import { PUB_IPFS_ENDPOINT, PUB_IPFS_API_KEY } from "@/constants";
import { CID, IPFSHTTPClient } from "ipfs-http-client";
import { Hex, fromHex } from "viem";

export function fetchJsonFromIpfs(ipfsUri: string) {
  return fetchFromIPFS(ipfsUri).then((res) => res.json());
}

export function uploadToIPFS(client: IPFSHTTPClient, blob: Blob) {
  return client.add(blob).then(({ cid }: { cid: CID }) => {
    return "ipfs://" + cid.toString();
  });
}

async function fetchFromIPFS(ipfsUri: string): Promise<Response> {
  if (!ipfsUri) throw new Error("Invalid IPFS URI");
  else if (ipfsUri.startsWith("0x")) {
    // fallback
    ipfsUri = fromHex(ipfsUri as Hex, "string");

    if (!ipfsUri) throw new Error("Invalid IPFS URI");
  }

  const path = resolvePath(ipfsUri);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 800);
  const response = await fetch(`${PUB_IPFS_ENDPOINT}/cat?arg=${path}`, {
    method: "POST",
    headers: {
      "X-API-KEY": PUB_IPFS_API_KEY,
      Accept: "application/json",
    },
    signal: controller.signal,
  });
  clearTimeout(id);
  if (!response.ok) {
    throw new Error("Could not connect to the IPFS endpoint");
  }
  return response; // .json(), .text(), .blob(), etc.
}

function resolvePath(uri: string) {
  const path = uri.includes("ipfs://") ? uri.substring(7) : uri;
  return path;
}
