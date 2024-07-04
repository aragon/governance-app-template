import { useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { parseAbi } from "viem";
import { PUB_CHAIN, PUB_TOKEN_ADDRESS, PUB_TOUCAN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useProposal } from "./useProposal";
import { useProposalVoteList } from "./useProposalVoteList";
import { useUserCanVote } from "./useUserCanVote";

const erc20VotesAbi = parseAbi(["function getVotes(address owner) view returns (uint256)"]);

export function useProposalVoting(proposalId: string) {
  const { address } = useAccount();
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;
  const { proposal, status: proposalFetchStatus } = useProposal(proposalId, true);
  const votes = useProposalVoteList(proposalId, proposal);
  const canVote = useUserCanVote(proposalId);

  const {
    data: addressVotes,
    isError: isErrorVotes,
    isLoading: isLoadingVotes,
  } = useReadContract({
    address: PUB_TOKEN_ADDRESS,
    abi: erc20VotesAbi,
    functionName: "getVotes",
    args: [address!],
  });
  const { writeContract: voteWrite, data: votingTxHash, error: votingError, status: votingStatus } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: votingTxHash });

  // Loading status and errors
  useEffect(() => {
    if (votingStatus === "idle" || votingStatus === "pending") return;
    else if (votingStatus === "error") {
      if (votingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(votingError);
        addAlert("Could not create the proposal", { type: "error" });
      }
      return;
    }

    // success
    if (!votingTxHash) return;
    else if (isConfirming) {
      addAlert("Vote submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: votingTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Vote registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: votingTxHash,
    });

    reload();
  }, [votingStatus, votingTxHash, isConfirming, isConfirmed]);

  const voteProposal = (votingOption: number, autoExecute: boolean = false) => {
    if (addressVotes === undefined) {
      addAlert("Could not fetch the user's voting power", { type: "error" });
      return;
    }

    const votingTally = {
      yes: votingOption === 1 ? addressVotes : 0n,
      no: votingOption === 2 ? addressVotes : 0n,
      abstain: votingOption === 3 ? addressVotes : 0n,
    };

    voteWrite({
      abi: TokenVotingAbi,
      address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
      functionName: "vote",
      args: [BigInt(proposalId), votingTally, autoExecute],
    });
  };

  return {
    proposal,
    proposalFetchStatus,
    votes,
    canVote,
    voteProposal,
    votingStatus,
    isConfirming,
    isConfirmed,
  };
}
