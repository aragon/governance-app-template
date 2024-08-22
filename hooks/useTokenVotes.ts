import { iVotesAbi } from "../plugins/members/artifacts/iVotes.sol";
import { PUB_CHAIN, PUB_TOKEN_ADDRESS } from "@/constants";
import { type Address } from "viem";
import { useReadContracts } from "wagmi";

/** Returns the delegate (if any) for the given address */
export const useTokenVotes = (address?: Address) => {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        abi: iVotesAbi,
        functionName: "delegates",
        args: [address!],
        address: PUB_TOKEN_ADDRESS,
      },
      {
        chainId: PUB_CHAIN.id,
        abi: iVotesAbi,
        functionName: "getVotes",
        args: [address!],
        address: PUB_TOKEN_ADDRESS,
      },
      {
        chainId: PUB_CHAIN.id,
        abi: iVotesAbi,
        functionName: "balanceOf",
        args: [address!],
        address: PUB_TOKEN_ADDRESS,
      },
    ],
    query: { enabled: !!address },
  });

  return {
    delegatesTo: data?.[0].result,
    votingPower: data?.[1].result,
    balance: data?.[2].result,
    isLoading,
    isError,
    refetch,
  };
};
