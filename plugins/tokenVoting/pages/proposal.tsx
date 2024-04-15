import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useProposal } from "@/plugins/tokenVoting/hooks/useProposal";
import { useProposalVoteList } from "@/plugins/tokenVoting/hooks/useProposalVoteList";
import { ToggleGroup, Toggle } from "@aragon/ods";
import ProposalDescription from "@/plugins/tokenVoting/components/proposal/description";
import VotesSection from "@/plugins/tokenVoting/components/vote/votes-section";
import ProposalHeader from "@/plugins/tokenVoting/components/proposal/header";
import { formatUnits } from "viem";
import { useUserCanVote } from "@/plugins/tokenVoting/hooks/useUserCanVote";
import VoteTally from "@/plugins/tokenVoting/components/vote/tally";
import VotingModal from "@/plugins/tokenVoting/components/vote/voting-modal";
import ProposalDetails from "@/plugins/tokenVoting/components/proposal/details";
import { Else, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVoting } from "../hooks/useProposalVoting";
import { useVotingToken } from "../hooks/useVotingToken";
import { useProposalExecute } from "../hooks/useProposalExecute";

type BottomSection = "description" | "votes";

export default function ProposalDetail({ id: proposalId }: { id: string }) {
  const { proposal, status: proposalFetchStatus } = useProposal(proposalId, true);
  const { tokenSupply } = useVotingToken();
  const { voteProposal, votingStatus, isConfirming: isVoteConfirming } = useProposalVoting(proposalId);
  const { canExecute, executeProposal, isConfirming: isExecuteConfirming } = useProposalExecute(proposalId);
  const votes = useProposalVoteList(proposalId, proposal);
  const userCanVote = useUserCanVote(BigInt(proposalId));
  const [votingPercentages, setVotingPercentages] = useState({
    yes: 0,
    no: 0,
    abstain: 0,
  });
  const [bottomSection, setBottomSection] = useState<BottomSection>("description");
  const [votedOption, setVotedOption] = useState<number | undefined>(undefined);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedVoteOption, setSelectedVoteOption] = useState<number>();
  const { address } = useAccount();

  useEffect(() => {
    if (showVotingModal) return;
    else if (!selectedVoteOption) return;

    voteProposal(selectedVoteOption, false);
  }, [selectedVoteOption, showVotingModal]);

  useEffect(() => {
    if (!proposal?.tally) return;

    const yesVotes = Number(formatUnits(proposal.tally.yes || BigInt(0), 18));
    const noVotes = Number(formatUnits(proposal.tally.no || BigInt(0), 18));
    const abstainVotes = Number(formatUnits(proposal.tally.abstain || BigInt(0), 18));
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

  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const showTransactionConfirming = votingStatus === "pending" || isVoteConfirming || isExecuteConfirming;

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex w-screen min-w-full max-w-full flex-col items-center">
      <div className="flex w-full justify-between py-5">
        <ProposalHeader
          proposalNumber={Number(proposalId) + 1}
          proposal={proposal}
          tokenSupply={tokenSupply || BigInt("0")}
          userVote={votedOption}
          transactionConfirming={showTransactionConfirming}
          canVote={!!userCanVote}
          canExecute={canExecute}
          onShowVotingModal={() => setShowVotingModal(true)}
          onExecute={() => executeProposal()}
        />
      </div>

      <div className="my-10 grid w-full gap-10 lg:grid-cols-2 xl:grid-cols-3">
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
          minVotingPower={proposal?.parameters?.minVotingPower}
          snapshotBlock={proposal?.parameters?.snapshotBlock}
        />
      </div>
      <div className="w-full py-12">
        <div className="space-between flex flex-row">
          <h2 className="flex-grow text-3xl font-semibold text-neutral-900">
            {bottomSection === "description" ? "Description" : "Votes"}
          </h2>
          <ToggleGroup
            className="justify-end"
            value={bottomSection}
            isMultiSelect={false}
            onChange={(val: string | undefined) => (val ? setBottomSection(val as BottomSection) : "")}
          >
            <Toggle label="Description" value="description" />
            <Toggle label="Votes" value="votes" />
          </ToggleGroup>
        </div>

        <If condition={bottomSection === "description"}>
          <Then>
            <ProposalDescription {...proposal} />
          </Then>
          <Else>
            <VotesSection votes={votes} />
          </Else>
        </If>
      </div>

      <If condition={showVotingModal}>
        <VotingModal onDismissModal={onDismissModal} selectedVote={onSelectVoteOption} />
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
