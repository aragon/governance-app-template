import { DelegateAnnouncerAbi } from "../artifacts/DelegationWall.sol";
import { PUB_DELEGATION_WALL_CONTRACT_ADDRESS } from "@/constants";
import { useMetadata } from "@/hooks/useMetadata";
import { fromHex, type Address } from "viem";
import { useReadContract } from "wagmi";
import { IAnnouncementMetadata } from "../utils/types";

/** Returns the announcement for the given delegate */
export const useDelegateAnnounce = (delegateAddress?: Address, options = {}) => {
  const { data: delegate } = useReadContract({
    address: PUB_DELEGATION_WALL_CONTRACT_ADDRESS,
    abi: DelegateAnnouncerAbi,
    functionName: "candidates",
    args: [delegateAddress!],
    query: { enabled: !!delegateAddress, ...options },
  });

  const { data: metadata, isLoading } = useMetadata<IAnnouncementMetadata>(delegate ? fromHex(delegate, "string") : "");

  return {
    announce: metadata,
    isLoading,
  };
};
