import { iVotesAbi } from "../artifacts/iVotes.sol";
import { PUB_TOKEN_ADDRESS } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { useState } from "react";
import { type Address } from "viem";

export const useDelegateVotingPower = (targetAddress: Address, onSuccess?: () => void) => {
  const [isDelegating, setIsDelegating] = useState(false);

  const { writeContract, status, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Delegation registered",
    onSuccess() {
      if (typeof onSuccess === "function") onSuccess();
    },
    onErrorMessage: "Could not delegate",
    onError() {
      setIsDelegating(false);
    },
  });

  const delegateVotingPower = () => {
    setIsDelegating(true);

    writeContract({
      abi: iVotesAbi,
      address: PUB_TOKEN_ADDRESS,
      functionName: "delegate",
      args: [targetAddress],
    });
  };

  return {
    delegateVotingPower,
    isConfirmed,
    isLoading: isDelegating || isConfirming,
    status,
  };
};
