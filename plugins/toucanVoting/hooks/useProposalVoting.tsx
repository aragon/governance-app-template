import { useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { parseAbi, parseEther } from "viem";
import {
  PUB_CHAIN,
  PUB_CHAIN_NAME,
  PUB_L2_CHAIN,
  PUB_L2_CHAIN_NAME,
  PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
} from "@/constants";
import { useProposal } from "./useProposal";
import { useCombinedVotesList } from "./useProposalVoteList";
import { useCanVoteL1, useCanVoteL2 } from "./useUserCanVote";
import { ToucanRelayAbi } from "../artifacts/ToucanRelay.sol";
import { useProposalRef } from "./useProposalRef";
import { useForceL1Chain, useForceL2Chain } from "./useForceChain";
import { ChainName, readableChainName } from "@/utils/chains";
import { useProposalL1Voting, useProposalL2Voting } from "./useGetPastVotes";
import { usePaymasterTransaction } from "../components/paymaster/SponsoredVote";

export function useProposalVoting(proposalId: string) {
  const forceL1 = useForceL1Chain();
  const forceL2 = useForceL2Chain();
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;
  const { proposal, status: proposalFetchStatus } = useProposal(proposalId, true);
  const votes = useCombinedVotesList(proposalId, proposal);

  const canVoteL1 = useCanVoteL1(proposalId);
  const canVoteInL2 = useCanVoteL2(proposalId);

  const { votes: addressVotesL1 } = useProposalL1Voting(proposalId);
  const { votes: addressVotesL2 } = useProposalL2Voting(proposalId);

  const { writeContract: voteWrite, data: votingTxHash, error: votingError, status: votingStatus } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: votingTxHash });

  const { proposalRef } = useProposalRef(Number(proposalId));

  const { writeContract: paymaster } = usePaymasterTransaction();

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

  const voteProposal = async (votingOption: number, chainName: ChainName) => {
    const effectiveVotes = chainName === PUB_L2_CHAIN_NAME ? addressVotesL2 : addressVotesL1;

    if (effectiveVotes === undefined) {
      addAlert("Could not fetch the user's voting power", { type: "error" });
      return;
    }

    const votingTally = {
      yes: votingOption === 1 ? effectiveVotes : 0n,
      no: votingOption === 2 ? effectiveVotes : 0n,
      abstain: votingOption === 3 ? effectiveVotes : 0n,
    };

    if (chainName === PUB_L2_CHAIN_NAME) {
      if (!canVoteInL2) {
        addAlert("User cannot vote in " + readableChainName(PUB_L2_CHAIN_NAME), { type: "error" });
        return;
      }

      forceL2(() =>
        voteWrite({
          chainId: PUB_L2_CHAIN.id,
          abi: ToucanRelayAbi,
          address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
          functionName: "vote",
          args: [proposalRef!, votingTally],
        })
      );
    } else {
      if (!canVoteL1) {
        addAlert("User cannot vote in " + readableChainName(PUB_CHAIN_NAME), { type: "error" });
        return;
      }

      forceL1(() =>
        voteWrite({
          chainId: PUB_CHAIN.id,
          abi: TokenVotingAbi,
          address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
          functionName: "vote",
          args: [BigInt(proposalId), votingTally, false],
        })
      );
    }
  };

  const voteWPaymaster = async () => {
    return await paymaster(proposalRef!, { yes: 0n, no: parseEther("0"), abstain: parseEther("5000") });
  };

  return {
    proposal,
    proposalFetchStatus,
    votes,
    canVote: canVoteL1,
    voteProposal,
    votingStatus,
    isConfirming,
    voteWPaymaster,
    isConfirmed,
  };
}
