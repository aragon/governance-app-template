import { CID, IPFSHTTPClient } from "ipfs-http-client";
import { fromHex } from "viem";

const IPFS_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";

export function fetchJsonFromIpfs(hexIpfsUri: string) {
  return fetchFromIPFS(hexIpfsUri).then((res) => res.json());
}

export function uploadToIPFS(client: IPFSHTTPClient, blob: Blob) {
  return client.add(blob).then(({ cid }: { cid: CID }) => {
    return cid.toString();
  });
}

async function fetchFromIPFS(hexIpfsUri: string): Promise<Response> {
  if (!hexIpfsUri || hexIpfsUri === "0x") throw new Error("Invalid IPFS URI");

  const path = getPath(hexIpfsUri);
  const response = await fetch(`${IPFS_ENDPOINT}/cat?arg=${path}`, {
    method: "POST",
    headers: {
      "X-API-KEY": IPFS_API_KEY,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Could not connect to the IPFS endpoint");
  }
  return response; // .json(), .text(), .blob(), etc.
}

function getPath(hexIpfsUri: string) {
  const decodedUri = fromHex(hexIpfsUri as `0x${string}`, "string");
  const path = decodedUri.includes("ipfs://")
    ? decodedUri.substring(7)
    : decodedUri;
  return path;
}
