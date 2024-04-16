import { useEffect } from "react";
import { usePublicClient, useWaitForTransactionReceipt, useWriteContract, useReadContract, useAccount } from "wagmi";
import { Address } from "viem";
import { ERC20PermitAbi } from "@/artifacts/ERC20Permit.sol";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/lockToVote/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/lockToVote/hooks/useUserCanVeto";
import { LockToVetoPluginAbi } from "@/plugins/lockToVote/artifacts/LockToVetoPlugin.sol";
import { usePermit } from "@/hooks/usePermit";
import { useAlerts, AlertContextProps } from "@/context/Alerts";
import { PUB_CHAIN, PUB_TOKEN_ADDRESS, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";

export function useProposalVeto(proposalId: string) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const { proposal, status: proposalFetchStatus, refetch: refetchProposal } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(publicClient!, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS, proposalId, proposal);
  const { signPermit, refetchPermitData } = usePermit();

  const { addAlert } = useAlerts() as AlertContextProps;
  const account_address = useAccount().address!;

  const { data: balanceData } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: ERC20PermitAbi,
    functionName: "balanceOf",
    args: [account_address],
  });

  const { writeContract: vetoWrite, data: vetoTxHash, error: vetoingError, status: vetoingStatus } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: vetoTxHash });
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(BigInt(proposalId));

  useEffect(() => {
    if (vetoingStatus === "idle" || vetoingStatus === "pending") return;
    else if (vetoingStatus === "error") {
      if (vetoingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(vetoingError);
        addAlert("Could not create the veto", { type: "error" });
      }
      return;
    }

    // success
    if (!vetoTxHash) return;
    else if (isConfirming) {
      addAlert("Veto submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: vetoTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Veto registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: vetoTxHash,
    });
    refetchCanVeto();
    refetchProposal();
    refetchPermitData();
  }, [vetoingStatus, vetoTxHash, isConfirming, isConfirmed]);

  const vetoProposal = () => {
    const dest: Address = PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS;
    const value = BigInt(Number(balanceData));
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60); // 1 hour from now

    signPermit(dest, value, deadline).then((sig) => {
      if (!sig?.yParity) throw new Error("Invalid signature");

      vetoWrite({
        abi: LockToVetoPluginAbi,
        address: dest,
        functionName: "vetoPermit",
        args: [BigInt(proposalId), value, deadline, sig.yParity, sig.r, sig.s],
      });
    });
  };

  return {
    proposal,
    proposalFetchStatus,
    vetoes,
    canVeto: !!canVeto,
    isConfirming: vetoingStatus === "pending" || isConfirming,
    isConfirmed,
    vetoProposal,
  };
}
