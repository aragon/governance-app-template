import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useRouter } from "next/router";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { useState } from "react";

export function useProposalClaimLock(proposalIdx: number) {
  const { reload } = useRouter();
  const account = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);

  const { data: hasClaimed } = useReadContract({
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: LockToVetoPluginAbi,
    chainId: PUB_CHAIN.id,
    functionName: "hasClaimedLock",
    args: [BigInt(proposalIdx), account.address!],
    query: {
      enabled: !!account.address,
    },
  });

  const { writeContract, isConfirming, isConfirmed } = useTransactionManager({
    onSuccessMessage: "Claim executed",
    onSuccess() {
      reload();
      setIsClaiming(false);
    },
    onErrorMessage: "Could not claim the locked tokens",
    onErrorDescription: "Please get in touch with us",
    onError() {
      setIsClaiming(false);
    },
  });

  const claimLockProposal = () => {
    if (hasClaimed) return;

    setIsClaiming(true);

    writeContract({
      chainId: PUB_CHAIN.id,
      abi: LockToVetoPluginAbi,
      address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
      functionName: "claimLock",
      args: [BigInt(proposalIdx), account.address!],
    });
  };

  return {
    claimLockProposal,
    hasClaimed: !!hasClaimed,
    isConfirming: isConfirming || isClaiming,
    isConfirmed,
  };
}
