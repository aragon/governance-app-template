import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { useRouter } from "next/router";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useTransactionManager } from "@/hooks/useTransactionManager";

export function useProposalVoting(proposalIdx: number) {
  const { reload } = useRouter();

  const {
    writeContract,
    status: votingStatus,
    isConfirming,
    isConfirmed,
  } = useTransactionManager({
    onSuccessMessage: "Vote registered",
    onSuccess: reload,
    onErrorMessage: "Could not submit the vote",
  });

  const voteProposal = (votingOption: number, autoExecute: boolean = false) => {
    writeContract({
      abi: TokenVotingAbi,
      address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
      functionName: "vote",
      args: [BigInt(proposalIdx), votingOption, autoExecute],
    });
  };

  return {
    voteProposal,
    status: votingStatus,
    isConfirming,
    isConfirmed,
  };
}
