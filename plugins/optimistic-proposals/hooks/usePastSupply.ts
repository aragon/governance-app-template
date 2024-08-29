import { PUB_TOKEN_ADDRESS } from "@/constants";
import { useReadContract } from "wagmi";
import { parseAbi } from "viem";
import { OptimisticProposal } from "../utils/types";

const erc20Votes = parseAbi(["function getPastTotalSupply(uint256 blockNumber) view returns (uint256)"]);

export function usePastSupply(proposal: OptimisticProposal | null) {
  const { data: pastSupply } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: erc20Votes,
    functionName: "getPastTotalSupply",
    args: [proposal?.parameters.snapshotTimestamp || BigInt(0)],
  });

  return pastSupply || BigInt(0);
}
