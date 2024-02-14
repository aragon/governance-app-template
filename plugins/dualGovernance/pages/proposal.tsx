import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import { Address } from "viem";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { useProposal } from "@/plugins/dualGovernance/hooks/useProposal";
import { useProposalVotes } from "@/plugins/dualGovernance/hooks/useProposalVotes";
import { ToggleGroup, Toggle } from "@aragon/ods";
import ProposalDescription from "@/plugins/dualGovernance/components/proposal/description";
import VotesSection from "@/plugins/dualGovernance/components/vote/votes-section";
import ProposalHeader from "@/plugins/dualGovernance/components/proposal/header";
import { formatUnits } from "viem";
import { useUserCanVote } from "@/plugins/dualGovernance/hooks/useUserCanVote";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import VoteTally from "@/plugins/dualGovernance/components/vote/tally";
import VotingModal from "@/plugins/dualGovernance/components/vote/voting-modal";
import ProposalDetails from "@/plugins/dualGovernance/components/proposal/details";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { Else, If, IfCase, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useRouter } from "next/router";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { goerli } from "viem/chains";

type BottomSection = "description" | "votes";

const PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS ||
  "") as Address;

export default function ProposalDetail({ id: proposalId}: {id: string}) {
  const skipRender = useSkipFirstRender();
  const publicClient = usePublicClient({chainId: goerli.id});

  const { proposal, status: proposalFetchStatus } = useProposal(
    publicClient,
    PLUGIN_ADDRESS,
    proposalId,
    true
  );
  const votes = useProposalVotes(
    publicClient,
    PLUGIN_ADDRESS,
    proposalId,
    proposal
  );
  const userCanVote = useUserCanVote(BigInt(proposalId));
  
  const [bottomSection, setBottomSection] =
    useState<BottomSection>("description");
  const [votedOption, setVotedOption] = useState<number | undefined>(undefined);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedVoteOption, setSelectedVoteOption] = useState<number>();
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { address, isConnected, isDisconnected } = useAccount();
  const { writeContract: vetoWrite, data: vetoResponse } = useWriteContract();

  const onDismissModal = () => {
    setSelectedVoteOption(0);
    setShowVotingModal(false);
  };

  const onSelectVoteOption = (selectedVoteOption: number) => {
    setSelectedVoteOption(selectedVoteOption);
    setShowVotingModal(false);
  };

  useEffect(() => {
      if(vetoResponse) addAlert("Your veto has been registered", vetoResponse);
  }, [vetoResponse])

  useEffect(() => {
    if (showVotingModal) return;
    else if (!selectedVoteOption) return;

    vetoWrite({
      abi: OptimisticTokenVotingPluginAbi,
      address: PLUGIN_ADDRESS,
      functionName: "veto",
      args: [proposalId],
    });
  }, [selectedVoteOption, showVotingModal]);

  const showLoading = getShowProposalLoading(proposal, proposalFetchStatus);

  if (skipRender || !proposal || showLoading) {
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
          userCanVote={userCanVote as boolean}
          onShowVotingModal={() => setShowVotingModal(true)}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VoteTally
          voteCount={proposal?.vetoTally}
          votePercentage={Number(proposal?.vetoTally / proposal?.parameters?.minVetoVotingPower) * 100}
        />
        <ProposalDetails
          minVetoVotingPower={proposal?.parameters?.minVetoVotingPower}
          endDate={proposal?.parameters?.endDate}
          snapshotBlock={proposal?.parameters?.snapshotBlock}
        />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {bottomSection === "description" ? "Description" : "Vetoes"}
          </h2>
          <ToggleGroup
            value={bottomSection}
            isMultiSelect={false}
            onChange={(val: string | undefined) =>
              val ? setBottomSection(val as BottomSection) : ""
            }
          >
            <Toggle label="Description" value="description" />
            <Toggle label="Vetoes" value="vetoes" />
          </ToggleGroup>
        </div>

        <IfCase condition={bottomSection === "description"}>
          <Then>
            <ProposalDescription {...proposal} />
          </Then>
          <Else>
            <VotesSection vetoes={votes} />
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

function resolveQueryParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  else if (Array.isArray(value)) return value[0];
  return "0";
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
