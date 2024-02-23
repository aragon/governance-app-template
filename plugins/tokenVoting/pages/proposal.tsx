import {
  usePublicClient,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import { useProposal } from "@/plugins/tokenVoting/hooks/useProposal";
import { useProposalVotes } from "@/plugins/tokenVoting/hooks/useProposalVotes";
import { ToggleGroup, Toggle } from "@aragon/ods";
import ProposalDescription from "@/plugins/tokenVoting/components/proposal/description";
import VotesSection from "@/plugins/tokenVoting/components/vote/votes-section";
import ProposalHeader from "@/plugins/tokenVoting/components/proposal/header";
import { formatUnits } from "viem";
import { useUserCanVote } from "@/plugins/tokenVoting/hooks/useUserCanVote";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import VoteTally from "@/plugins/tokenVoting/components/vote/tally";
import VotingModal from "@/plugins/tokenVoting/components/vote/voting-modal";
import ProposalDetails from "@/plugins/tokenVoting/components/proposal/details";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { Else, If, IfCase, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useRouter } from "next/router";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";

type BottomSection = "description" | "votes";

export default function ProposalDetail({ id: proposalId }: { id: string }) {
  const { reload } = useRouter();
  const skipRender = useSkipFirstRender();
  const publicClient = usePublicClient();

  const { proposal, status: proposalFetchStatus } = useProposal(
    publicClient!,
    PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
    proposalId,
    true
  );
  const votes = useProposalVotes(
    publicClient!,
    PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
    proposalId,
    proposal
  );
  const userCanVote = useUserCanVote(BigInt(proposalId));
  const [votingPercentages, setVotingPercentages] = useState({
    yes: 0,
    no: 0,
    abstain: 0,
  });
  const [bottomSection, setBottomSection] =
    useState<BottomSection>("description");
  const [votedOption, setVotedOption] = useState<number | undefined>(undefined);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedVoteOption, setSelectedVoteOption] = useState<number>();
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { address } = useAccount();
  const {
    writeContract: voteWrite,
    data: votingTxHash,
    error,
    status,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: votingTxHash });

  useEffect(() => {
    if (!proposal?.tally) return;

    const yesVotes = Number(formatUnits(proposal.tally.yes || BigInt(0), 18));
    const noVotes = Number(formatUnits(proposal.tally.no || BigInt(0), 18));
    const abstainVotes = Number(
      formatUnits(proposal.tally.abstain || BigInt(0), 18)
    );
    const totalVotes = yesVotes + noVotes + abstainVotes;

    setVotingPercentages({
      yes: (yesVotes / totalVotes) * 100,
      no: (noVotes / totalVotes) * 100,
      abstain: (abstainVotes / totalVotes) * 100,
    });
  }, [proposalFetchStatus.proposalLoading, proposalFetchStatus.proposalReady]);

  useEffect(() => {
    setVotedOption(votes.find((vote) => vote.voter === address)?.voteOption);
  }, [votes]);

  const onDismissModal = () => {
    setSelectedVoteOption(0);
    setShowVotingModal(false);
  };

  const onSelectVoteOption = (selectedVoteOption: number) => {
    setSelectedVoteOption(selectedVoteOption);
    setShowVotingModal(false);
  };

  useEffect(() => {
    if (status === "idle" || status === "pending") return;
    else if (status === "error") {
      if (error?.message?.startsWith("User rejected the request")) return;
      alert("Could not create the proposal");
      return;
    }

    // success
    if (!votingTxHash) return;
    else if (isConfirming) {
      addAlert("The vote has been submitted", votingTxHash);
      return;
    } else if (!isConfirmed) return;

    // addAlert("The vote has been registered", votingTxHash);
    reload();
  }, [status, votingTxHash, isConfirming, isConfirmed]);

  useEffect(() => {
    if (showVotingModal) return;
    else if (!selectedVoteOption) return;

    voteWrite({
      abi: TokenVotingAbi,
      address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
      functionName: "vote",
      args: [proposalId, selectedVoteOption, 1],
    });
  }, [selectedVoteOption, showVotingModal]);

  const showProposalLoading = getShowProposalLoading(
    proposal,
    proposalFetchStatus
  );
  const showTransactionLoading = status === "pending" || isConfirming;

  if (skipRender || !proposal || showProposalLoading) {
    return (
      <section className="flex justify-left items-left w-screen max-w-full min-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="flex justify-between py-5 w-full">
        <ProposalHeader
          proposalNumber={Number(proposalId)}
          proposal={proposal}
          userVote={votedOption}
          transactionLoading={showTransactionLoading}
          userCanVote={userCanVote as boolean}
          onShowVotingModal={() => setShowVotingModal(true)}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VoteTally
          voteType="Yes"
          voteCount={proposal?.tally?.yes}
          votePercentage={votingPercentages.yes}
          color="success"
        />
        <VoteTally
          voteType="No"
          voteCount={proposal?.tally?.no}
          votePercentage={votingPercentages.no}
          color="critical"
        />
        <VoteTally
          voteType="Abstain"
          voteCount={proposal?.tally?.abstain}
          votePercentage={votingPercentages.abstain}
          color="neutral"
        />
        <ProposalDetails
          supportThreshold={proposal?.parameters?.supportThreshold}
          endDate={proposal?.parameters?.endDate}
          snapshotBlock={proposal?.parameters?.snapshotBlock}
        />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {bottomSection === "description" ? "Description" : "Votes"}
          </h2>
          <ToggleGroup
            value={bottomSection}
            isMultiSelect={false}
            onChange={(val: string | undefined) =>
              val ? setBottomSection(val as BottomSection) : ""
            }
          >
            <Toggle label="Description" value="description" />
            <Toggle label="Votes" value="votes" />
          </ToggleGroup>
        </div>

        <IfCase condition={bottomSection === "description"}>
          <Then>
            <ProposalDescription {...proposal} />
          </Then>
          <Else>
            <VotesSection votes={votes} />
          </Else>
        </IfCase>
      </div>

      <If condition={showVotingModal}>
        <VotingModal
          onDismissModal={onDismissModal}
          selectedVote={onSelectVoteOption}
        />
      </If>
    </section>
  );
}

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal && status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
