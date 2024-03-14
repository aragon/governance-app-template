import { useEffect } from "react";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContracts,
  useSignTypedData,
  useAccount,
} from "wagmi";
import { hexToSignature } from "viem";
import { useProposal } from "./useProposal";
import { useProposalVetoes } from "@/plugins/lockToVote/hooks/useProposalVetoes";
import { useUserCanVeto } from "@/plugins/lockToVote/hooks/useUserCanVeto";
import { LockToVetoPluginAbi } from "@/plugins/lockToVote/artifacts/LockToVetoPlugin.sol";
import { ERC20Abi } from "@/plugins/lockToVote/artifacts/ERC20withPermit.sol";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { PUB_CHAIN, PUB_TOKEN_ADDRESS, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";

export function useProposalVeto(proposalId: string) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });

  const {
    proposal,
    status: proposalFetchStatus,
    refetch: refetchProposal,
  } = useProposal(proposalId, true);
  const vetoes = useProposalVetoes(
    publicClient!,
    PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    proposalId,
    proposal
  );

  const { addAlert } = useAlertContext() as AlertContextProps;
  const account_address = useAccount().address!;

  const erc20Contract = {
    address: PUB_TOKEN_ADDRESS,
    abi: ERC20Abi,
  };
  const { data: erc20data } = useReadContracts({
    contracts: [{
      ...erc20Contract,
      functionName: "balanceOf",
      args: [account_address],
    },{
      ...erc20Contract,
      functionName: "nonces",
      args: [account_address],
    },{
      ...erc20Contract,
      functionName: "name",
    },{
      ...erc20Contract,
      functionName: "version",
    }]
  });

  const [balanceResult, nonceResult, nameResult, versionResult] = erc20data || [];

  const balance = BigInt(Number(balanceResult?.result));
  const nonce = BigInt(Number(nonceResult?.result));
  const erc20_name = nameResult?.result;
  const versionFromContract = versionResult?.result;

  const { signTypedData: vetoPermitSign } = useSignTypedData();
  const {
    writeContract: vetoWrite,
    data: vetoTxHash,
    error: vetoingError,
    status: vetoingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: vetoTxHash });
  const { canVeto, refetch: refetchCanVeto } = useUserCanVeto(
    BigInt(proposalId)
  );

  useEffect(() => {
    if (vetoingStatus === "idle" || vetoingStatus === "pending") return;
    else if (vetoingStatus === "error") {
      if (vetoingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
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
  }, [vetoingStatus, vetoTxHash, isConfirming, isConfirmed]);

  const vetoProposal = () => {
    let deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60);
    let value = balance; 
    let destination: `0x${string}` = PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS;

    const domain = {
      chainId: PUB_CHAIN.id,
      name: String(erc20_name),
      /* We assume 1 if permit version is not specified */
      version: String(versionFromContract ?? '1'),
      verifyingContract: PUB_TOKEN_ADDRESS,
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const message = {
      owner: account_address,
      spender: destination,
      value,
      nonce,
      deadline,
    };

    vetoPermitSign({
      account: account_address,
      types,
      domain,
      primaryType: 'Permit',
      message,
    }, { onSuccess: (hexSignature) => {
      let signature = hexToSignature(hexSignature);

      vetoWrite({
        abi: LockToVetoPluginAbi,
        address: destination,
        functionName: "vetoPermit",
        args: [proposalId, value, deadline, signature.v, signature.r, signature.s],
      });
    }});
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
