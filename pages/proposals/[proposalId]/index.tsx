import { usePublicClient, useAccount, useContractWrite } from "wagmi";
import { useState, useContext, useEffect } from "react";
import { Address } from "viem";
import { Proposal } from "../../../utils/types";
import { useProposal } from "@/hooks/useProposal";
import { useProposalVotes } from "@/hooks/useProposalVotes";
import { Button } from "@aragon/ods";
import ProposalDescription from "@/components/proposal/description";
import VotesSection from "@/components/vote/votes-section";
import ProposalHeader from "@/components/proposal/header";
import { formatUnits } from "viem";
import { useUserCanVote } from "@/hooks/useUserCanVote";
import { TokenVotingAbi } from "@/artifacts/TokenVoting.sol";
import VoteTally from "@/components/vote/tally";
import VotingModal from "@/components/vote/voting-modal";
import ProposalDetails from "@/components/proposal/details";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { Else, If, IfCase, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useRouter } from "next/router";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export default function Proposal() {
  const publicClient = usePublicClient();
  const { query } = useRouter();
  let proposalId = "";
  if (typeof query.proposalId === "string") proposalId = query.proposalId;
  else if (Array.isArray(query.proposalId)) proposalId = query.proposalId[0];

  const proposal = useProposal(
    publicClient,
    pluginAddress,
    proposalId
  ) as Proposal;
  const votes = useProposalVotes(
    publicClient,
    pluginAddress,
    proposalId,
    proposal
  );
  const userCanVote = useUserCanVote(BigInt(proposalId));
  const [votingPercentages, setVotingPercentages] = useState({
    yes: 0,
    no: 0,
    abstain: 0,
  });
  const [userVote, setUserVote] = useState<number|undefined>(undefined)
  const [showDescriptionView, toggleDetailsView] = useState<boolean>(true);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [userVotedOption, setUserVotedOption] = useState<number>();
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { address, isConnected, isDisconnected } = useAccount();
  const { write: voteWrite } = useContractWrite({
    abi: TokenVotingAbi,
    address: pluginAddress,
    functionName: "vote",
    args: [proposalId, userVotedOption, 1],
    onSuccess(data) {
      // console.log("Success creating the proposal", data);
      addAlert("We got your vote!", data.hash);
    },
  });

  useEffect(() => {
    if (!proposal.tally) return;

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
  }, [proposal.tally]);

  useEffect(() => {
    setUserVote(votes.find((vote) => vote.voter === address)?.voteOption)
  }, [votes])

  const voteFor = (option: number) => {
    setUserVotedOption(option);
    setShowVotingModal(false);
  };

  useEffect(() => {
    if (userVotedOption && !showVotingModal) voteWrite?.();
  }, [userVotedOption, showVotingModal]);

  if (!proposal.title || !proposal?.parameters?.supportThreshold) {
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
          userVote={userVote}
          userCanVote={userCanVote as boolean}
          setShowVotingModal={setShowVotingModal}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VoteTally
          voteType="Yes"
          voteCount={proposal?.tally?.yes}
          votePercentage={votingPercentages.yes}
          votes={votes}
          color="success"
          option={2}
        />
        <VoteTally
          voteType="No"
          voteCount={proposal?.tally?.no}
          votePercentage={votingPercentages.no}
          votes={votes}
          color="critical"
          option={3}
        />
        <VoteTally
          voteType="Abstain"
          voteCount={proposal?.tally?.abstain}
          votePercentage={votingPercentages.abstain}
          votes={votes}
          color="neutral"
          option={1}
        />

        <ProposalDetails
          supportThreshold={proposal.parameters.supportThreshold}
          endDate={proposal.parameters.endDate}
          snapshotBlock={proposal.parameters.snapshotBlock}
        />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {showDescriptionView ? "Description" : "Votes"}
          </h2>
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => toggleDetailsView(true)}
              size="md"
              variant={showDescriptionView ? "primary" : "secondary"}
            >
              Description
            </Button>
            <Button
              onClick={() => toggleDetailsView(false)}
              size="md"
              variant={showDescriptionView ? "secondary" : "primary"}
            >
              Votes
            </Button>
          </div>
        </div>

        <IfCase condition={showDescriptionView}>
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
          show={showVotingModal}
          setShow={setShowVotingModal}
          voteFor={voteFor}
        />
      </If>
    </section>
  );
}
