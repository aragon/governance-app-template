'use client';

import { useProposal } from "../../hooks/useProposal";
import { ToggleGroup, Toggle } from "@aragon/ods";
import ProposalDescription from "../../components/proposal/description";
import VetoesSection from "../../components/vote/vetoes-section";
import ProposalHeader from "../../components/proposal/header";
import VetoTally from "../../components/vote/tally";
import ProposalDetails from "../../components/proposal/details";
import { Else, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useState } from "react";
import { useProposalVeto } from "../../hooks/useProposalVeto";
import { useProposalExecute } from "../../hooks/useProposalExecute";

type BottomSection = "description" | "vetoes";

export default function ProposalDetail({ params }: { params: { proposalId: string } }) {
  const [bottomSection, setBottomSection] =
    useState<BottomSection>("description");

  const proposalId = params.proposalId;

  const {
    proposal,
    proposalFetchStatus,
    vetoes,
    canVeto,
    isConfirming: isConfirmingVeto,
    vetoProposal,
  } = useProposalVeto(proposalId);

  const showProposalLoading = getShowProposalLoading(
    proposal,
    proposalFetchStatus
  );

  const {
    executeProposal,
    canExecute,
    isConfirming: isConfirmingExecution,
  } = useProposalExecute(proposalId);

  if (!proposal || showProposalLoading) {
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
          proposalNumber={Number(proposalId) + 1}
          proposal={proposal}
          transactionConfirming={isConfirmingVeto || isConfirmingExecution}
          canVeto={canVeto}
          canExecute={canExecute}
          onVetoPressed={() => vetoProposal()}
          onExecutePressed={() => executeProposal()}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VetoTally
          voteCount={proposal?.vetoTally}
          votePercentage={
            Number(
              proposal?.vetoTally / proposal?.parameters?.minVetoVotingPower
            ) * 100
          }
        />
        <ProposalDetails
          minVetoVotingPower={proposal?.parameters?.minVetoVotingPower}
          snapshotBlock={proposal?.parameters?.snapshotBlock}
        />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {bottomSection === "description" ? "Description" : "Vetoes"}
          </h2>
          <ToggleGroup
            className="justify-end"
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

        <If condition={bottomSection === "description"}>
          <Then>
            <ProposalDescription {...proposal} />
          </Then>
          <Else>
            <VetoesSection vetoes={vetoes} />
          </Else>
        </If>
      </div>
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
