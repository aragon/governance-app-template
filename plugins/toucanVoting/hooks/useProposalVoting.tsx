import { useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { parseAbi } from "viem";
import {
  PUB_CHAIN,
  PUB_TOKEN_ADDRESS,
  PUB_TOKEN_L2_ADDRESS,
  PUB_TOUCAN_RECEIVER_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
} from "@/constants";
import { useProposal } from "./useProposal";
import { useProposalVoteList } from "./useProposalVoteList";
import { useUserCanVote } from "./useUserCanVote";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { ToucanReceiverAbi } from "../artifacts/ToucanReceiver.sol";
import { optimismSepolia } from "viem/chains";

const erc20VotesAbi = parseAbi(["function getPastVotes(address owner, uint256 timepoint) view returns (uint256)"]);

export function useProposalVoting(proposalId: string) {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
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
    chainId: PUB_CHAIN.id,
    address: PUB_TOKEN_ADDRESS,
    abi: erc20VotesAbi,
    functionName: "getPastVotes",
    args: [address!, proposal?.parameters.snapshotBlock || 0n],
    query: {
      enabled: proposal?.parameters.snapshotBlock !== undefined,
    },
  });
  const {
    data: addressVotesL2,
    isError: isErrorVotesL2,
    isLoading: isLoadingVotesL2,
  } = useReadContract({
    chainId: optimismSepolia.id,
    address: PUB_TOKEN_L2_ADDRESS,
    abi: erc20VotesAbi,
    functionName: "getPastVotes",
    args: [address!, proposal?.parameters.startDate || 0n],
    query: {
      enabled: !!proposal && proposal?.parameters.snapshotBlock !== undefined,
    },
  });
  const { writeContract: voteWrite, data: votingTxHash, error: votingError, status: votingStatus } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: votingTxHash });

  const { data: proposalRef } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOUCAN_RECEIVER_ADDRESS,
    abi: ToucanReceiverAbi,
    functionName: "getProposalRef",
    args: [BigInt(proposalId)],
  });

  const {
    data: canVoteInL2,
    refetch: refecthCanVoteInL2,
    error,
    fetchStatus,
  } = useReadContract({
    chainId: optimismSepolia.id,
    address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
    abi: ToucanRelayAbi,
    functionName: "canVote",
    args: [proposalRef!, address!, { abstain: 0n, yes: 1n, no: 0n }],
    query: {
      enabled: proposalRef !== undefined,
    },
  });

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
        addAlert("Could not vote in the proposal", { type: "error" });
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

  const voteProposal = async (votingOption: number, autoExecute: boolean = false) => {
    let effectiveVotes = addressVotes;
    if (canVoteInL2 && canVoteInL2[0]) {
      effectiveVotes = addressVotesL2;
    }
    if (effectiveVotes === undefined) {
      addAlert("Could not fetch the user's voting power", { type: "error" });
      return;
    }

    const votingTally = {
      yes: votingOption === 1 ? effectiveVotes : 0n,
      no: votingOption === 2 ? effectiveVotes : 0n,
      abstain: votingOption === 3 ? effectiveVotes : 0n,
    };

    if (canVoteInL2 && canVoteInL2[0]) {
      if (chainId === PUB_CHAIN.id) await switchChainAsync({ chainId: optimismSepolia.id });
      voteWrite({
        chainId: optimismSepolia.id,
        abi: ToucanRelayAbi,
        address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
        functionName: "vote",
        args: [proposalRef!, votingTally],
      });
    } else {
      voteWrite({
        abi: TokenVotingAbi,
        address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
        functionName: "vote",
        args: [BigInt(proposalId), votingTally, false],
      });
    }
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
