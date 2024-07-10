import { usePublicClient } from "wagmi";

// This results in a crap ton of requests to the RPC node, so we need a better way.
export async function getBlockNumberAtTimestamp(
  timestamp: bigint,
  client: ReturnType<typeof usePublicClient>
): Promise<bigint> {
  const latestBlock = await client!.getBlock();
  const end = latestBlock.number;

  async function recursiveSearch(start: bigint, end: bigint): Promise<bigint> {
    if (start > end) {
      const closestBlock = await client!.getBlock({ blockNumber: start });
      return closestBlock?.number ?? latestBlock.number;
    }

    const mid = (start + end) / 2n;
    const block = await client!.getBlock({ blockNumber: mid });

    if (block.timestamp === timestamp) {
      return block.number;
    } else if (block.timestamp < timestamp) {
      return recursiveSearch(mid + 1n, end);
    } else {
      return recursiveSearch(start, mid - 1n);
    }
  }

  return recursiveSearch(0n, end);
}
