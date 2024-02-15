import { usePublicClient, useWriteContract } from "wagmi";
import { useState, useEffect } from "react";
import { Address } from "viem";
import { useProposal } from "@/plugins/dualGovernance/hooks/useProposal";
import { useProposalVetoes } from "@/plugins/dualGovernance/hooks/useProposalVetoes";
import { ToggleGroup, Toggle } from "@aragon/ods";
import ProposalDescription from "@/plugins/dualGovernance/components/proposal/description";
import VetoesSection from "@/plugins/dualGovernance/components/vote/vetoes-section";
import ProposalHeader from "@/plugins/dualGovernance/components/proposal/header";
import { useUserCanVeto } from "@/plugins/dualGovernance/hooks/useUserCanVeto";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import VetoTally from "@/plugins/dualGovernance/components/vote/tally";
import ProposalDetails from "@/plugins/dualGovernance/components/proposal/details";
import { useAlertContext, AlertContextProps } from "@/context/AlertContext";
import { Else, IfCase, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { goerli } from "viem/chains";

type BottomSection = "description" | "vetoes";

const PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS || "") as Address;

export default function ProposalDetail({ id: proposalId}: {id: string}) {
  const skipRender = useSkipFirstRender();
  const publicClient = usePublicClient({chainId: goerli.id});

  const { proposal, status: proposalFetchStatus } = useProposal(
    publicClient,
    PLUGIN_ADDRESS,
    proposalId,
    true
  );
  const vetoes = useProposalVetoes(
    publicClient,
    PLUGIN_ADDRESS,
    proposalId,
    proposal
  );
  const userCanVeto = useUserCanVeto(BigInt(proposalId));
  
  const [bottomSection, setBottomSection] =
    useState<BottomSection>("description");
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { writeContract: vetoWrite, data: vetoResponse } = useWriteContract();

  useEffect(() => {
      if(vetoResponse) addAlert("Your veto has been submitted", vetoResponse);
  }, [vetoResponse])

  const vetoProposal = () => {
    vetoWrite({
      abi: OptimisticTokenVotingPluginAbi,
      address: PLUGIN_ADDRESS,
      functionName: "veto",
      args: [proposalId],
    });
  };

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
          userCanVeto={userCanVeto as boolean}
          onVetoPressed={() => vetoProposal()}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VetoTally
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
            <VetoesSection vetoes={vetoes} />
          </Else>
        </IfCase>
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
