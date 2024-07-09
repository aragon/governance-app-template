import { type useProposal } from "@/plugins/toucanVoting/hooks/useProposal";
import ProposalHeader from "@/plugins/toucanVoting/components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVoting } from "@/plugins/toucanVoting/hooks/useProposalVoting";
import { useProposalExecute } from "@/plugins/toucanVoting/hooks/useProposalExecute";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { ProposalAction } from "@/components/proposalAction/proposalAction";
import { CardResources } from "@/components/proposal/cardResources";
import DispatchVotes from "../components/bridge/DispatchVotes";
import { L2ProposalVoting } from "../components/vote/CrosschainVoting/CrosschainVotingHeader";
import { IBreadcrumbsLink } from "@aragon/ods";
import { If } from "@/components/if";

// rather than change the common utility, adding a new one here
// for the time being that is specific to this plugin
// see utils/nav.ts for details
function generateToucanBreadcrumbs(proposalId: string | number | bigint): IBreadcrumbsLink[] {
  return [
    {
      label: "Proposals",
      href: "/plugins/crosschain-voting/#/",
    },
    {
      label: proposalId.toString(),
      href: "/#/plugins/crosschain-voting/proposals/" + proposalId.toString(),
    },
  ];
}

export default function ProposalDetail({ id: proposalId }: { id: string }) {
  const { proposal, proposalFetchStatus, isConfirming: isConfirmingApproval } = useProposalVoting(proposalId);
  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalId);
  const breadcrumbs = generateToucanBreadcrumbs(proposalId);
  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const hasAction = proposal?.actions?.length ?? 0 > 0;

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className=" flex w-screen min-w-full max-w-full flex-col items-center">
      <ProposalHeader
        proposalNumber={Number(proposalId) + 1}
        proposal={proposal}
        breadcrumbs={breadcrumbs}
        transactionConfirming={isConfirmingApproval || isConfirmingExecution}
        canExecute={canExecute}
        onExecutePressed={() => executeProposal()}
      />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySection body={proposal.description || "No description was provided"} />
            <L2ProposalVoting proposalId={proposalId} />
            <If condition={hasAction}>
              <ProposalAction
                onExecute={() => executeProposal()}
                isConfirmingExecution={isConfirmingExecution}
                canExecute={canExecute}
                actions={proposal.actions}
              />
            </If>
          </div>
          <div className="flex flex-col gap-y-6 md:w-[33%]">
            {/* Might be better to put a sentinel value here */}
            <DispatchVotes id={Number(proposalId ?? 0)} />
            <CardResources resources={proposal.resources} title="Resources" />
          </div>
        </div>
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
