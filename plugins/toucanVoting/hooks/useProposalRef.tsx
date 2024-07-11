import { useReadContract } from "wagmi";
import { PUB_CHAIN, PUB_TOUCAN_RECEIVER_ADDRESS } from "@/constants";
import { ToucanReceiverAbi } from "../artifacts/ToucanReceiver.sol";

export function useProposalRef(proposalId: number) {
  const {
    data: proposalRef,
    isLoading,
    isError,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_RECEIVER_ADDRESS,
    abi: ToucanReceiverAbi,
    functionName: "getProposalRef",
    args: [BigInt(proposalId ?? 0)],
    query: { enabled: proposalId !== undefined },
  });

  return {
    proposalRef,
    status: {
      isLoading,
      isError,
    },
  };
}
