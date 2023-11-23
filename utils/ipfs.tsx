import { CID } from 'ipfs-http-client';
import { fromHex } from 'viem';
import { Address } from 'viem'

const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const ipfsKey = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";

export function getPath(hexedIpfs: Address) {
  const ipfsPath = fromHex(hexedIpfs, 'string')
  const path = ipfsPath.includes('ipfs://') ? ipfsPath.substring(7) : ipfsPath
  return path
}
export async function fetchFromIPFS(ipfsPath: string | undefined) {
  if (!ipfsPath) return
  const path = getPath((ipfsPath as Address))
  const response = await fetch(`${ipfsEndpoint}/cat?arg=${path}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': ipfsKey,
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // or .text(), .blob(), etc., depending on the data format
}


export async function uploadToIPFS(client: any, blob: Blob) {
  try {
    const { cid }: {cid: CID} = await client.add(blob);
    return cid.toString()
  } catch (error) {
    console.error('Error uploading file: ', error);
  }
}