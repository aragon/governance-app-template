import { PUB_IPFS_ENDPOINT, PUB_IPFS_API_KEY } from "@/constants";
import { CID, IPFSHTTPClient } from "ipfs-http-client";
import { fromHex, Address } from "viem";

export function fetchJsonFromIpfs(hexIpfsUri: string) {
  return fetchFromIPFS(hexIpfsUri).then((res) => res.json());
}

export function uploadToIPFS(client: IPFSHTTPClient, blob: Blob) {
  return client.add(blob).then(({ cid }: { cid: CID }) => {
    return "ipfs://" + cid.toString();
  });
}

async function fetchFromIPFS(hexIpfsUri: string): Promise<Response> {
  if (!hexIpfsUri || hexIpfsUri === "0x") throw new Error("Invalid IPFS URI");

  const path = getPath(hexIpfsUri);
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

function getPath(hexIpfsUri: string) {
  const decodedUri = fromHex(hexIpfsUri as Address, "string");
  const path = decodedUri.includes("ipfs://")
    ? decodedUri.substring(7)
    : decodedUri;
  return path;
}
