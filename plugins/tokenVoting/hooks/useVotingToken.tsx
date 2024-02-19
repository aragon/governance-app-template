import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { PUB_TOKEN_ADDRESS } from "@/constants";

export function useVotingToken() {
  const {
    data: tokenSupply,
    isError,
    isLoading,
  } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  return {
    address: PUB_TOKEN_ADDRESS,
    tokenSupply,
    status: {
      isLoading,
      isError,
    },
  };
}
