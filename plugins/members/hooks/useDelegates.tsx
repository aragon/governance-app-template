import { useConfig } from "wagmi";
import { DelegateAnnouncerAbi } from "@/plugins/members/artifacts/DelegationWall.sol";
import { PUB_DELEGATION_WALL_CONTRACT_ADDRESS } from "@/constants";
import { readContract } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { useShuffled } from "@/hooks/useShuffled";

/** Returns the list of delegates who posted a candidacy */
export function useDelegates() {
  const config = useConfig();

  const { data, status, refetch } = useQuery({
    queryKey: ["delegate-addresses-list", PUB_DELEGATION_WALL_CONTRACT_ADDRESS],
    queryFn: () => {
      return readContract(config, {
        abi: DelegateAnnouncerAbi,
        address: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
        functionName: "getCandidateAddresses",
        args: [],
      });
    },
    retry: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: true,
    staleTime: 1000 * 60 * 10,
  });
  const shuffledDelegates = useShuffled(data);

  return { delegates: shuffledDelegates, status, refetch };
}
