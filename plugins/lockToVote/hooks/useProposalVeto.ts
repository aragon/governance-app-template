import { useReadContract, useAccount } from "wagmi";
import { Address } from "viem";
import { ERC20PermitAbi } from "@/artifacts/ERC20Permit.sol";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "./useProposalVetoes";
import { useUserCanVeto } from "./useUserCanVeto";
import { LockToVetoPluginAbi } from "../artifacts/LockToVetoPlugin.sol";
import { usePermit } from "@/hooks/usePermit";
import { PUB_TOKEN_ADDRESS, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";
import { ADDRESS_ZERO } from "@/utils/evm";

export function useProposalVeto(proposalId: number) {
  const { proposal, status: proposalFetchStatus, refetch: refetchProposal } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS, proposalId, proposal);
  const { signPermit, refetchPermitData } = usePermit();
  const { address } = useAccount();

  const { data: balanceData } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: ERC20PermitAbi,
    functionName: "balanceOf",
    args: [address || ADDRESS_ZERO],
  });
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(proposalId);

  const {
    writeContract,
    status: vetoingStatus,
    isConfirming,
    isConfirmed,
  } = useTransactionManager({
    onSuccessMessage: "Veto registered",
    onSuccess() {
      refetchCanVeto();
      refetchProposal();
      refetchPermitData();
    },
    onErrorMessage: "Could not submit the veto",
  });

  const vetoProposal = () => {
    const dest: Address = PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS;
    const value = BigInt(Number(balanceData));
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60); // 1 hour from now

    signPermit(dest, value, deadline).then((sig) => {
      if (!sig?.yParity) throw new Error("Invalid signature");

      writeContract({
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
