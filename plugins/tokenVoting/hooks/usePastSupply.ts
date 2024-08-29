import { PUB_TOKEN_ADDRESS } from "@/constants";
import { useReadContract } from "wagmi";
import { parseAbi } from "viem";

const erc20Votes = parseAbi(["function getPastTotalSupply(uint256 blockNumber) view returns (uint256)"]);

export function usePastSupply(snapshotBlock: bigint | undefined) {
  const { data: pastSupply } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: erc20Votes,
    functionName: "getPastTotalSupply",
    args: [BigInt(snapshotBlock || 0)],
  });

  return pastSupply || BigInt(0);
}
