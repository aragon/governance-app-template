import { type useProposal } from "@/plugins/toucanVoting/hooks/useProposal";
import ProposalHeader from "@/plugins/toucanVoting/components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVoting } from "@/plugins/toucanVoting/hooks/useProposalVoting";
import { useProposalExecute } from "@/plugins/toucanVoting/hooks/useProposalExecute";
import { generateBreadcrumbs } from "@/utils/nav";
import { useRouter } from "next/router";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { ProposalVoting } from "@/components/proposalVoting";
import { IBreakdownMajorityVotingResult, type ITransformedStage, type IVote, ProposalStages } from "@/utils/types";
import { useProposalStatus } from "../hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { ProposalAction } from "@/components/proposalAction/proposalAction";
import { CardResources } from "@/components/proposal/cardResources";
import { getWinningOption } from "../utils/proposal-status";

export default function ProposalDetail({ id: proposalId }: { id: string }) {
  const router = useRouter();

  const {
    proposal,
    proposalFetchStatus,
    canVote,
    votes,
    isConfirming: isConfirmingApproval,
    voteProposal,
  } = useProposalVoting(proposalId);

  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalId);
  const breadcrumbs = generateBreadcrumbs(router.asPath);

  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const proposalVariant = useProposalStatus(proposal!);

  // TODO: This is not revelant anymore
  const proposalStage: ITransformedStage[] = [
    {
      id: "1",
      type: ProposalStages.MAJORITY_VOTING,
      variant: "majorityVoting",
      title: "",
      status: proposalVariant!,
      disabled: false,
      proposalId: proposalId,
      providerId: "1",
      result: {
        cta: proposal?.executed
          ? {
              disabled: true,
              label: "Executed",
            }
          : canExecute
            ? {
                isLoading: isConfirmingExecution,
                label: "Execute",
                onClick: executeProposal,
              }
            : {
                disabled: !canVote,
                isLoading: isConfirmingApproval,
                label: "Vote",
                onClick: voteProposal,
              },
        votingScores: [{ ...getWinningOption(proposal?.tally), tokenSymbol: "HLO" }],
      },
      details: {
        censusBlock: Number(proposal?.parameters.snapshotBlock),
        startDate: "",
        endDate: dayjs(Number(proposal?.parameters.endDate) * 1000).toString(),
        strategy: "Majority Voting",
        options: "yes, no, abstain",
      },
      votes: votes && votes.map(({ address }) => ({ address, variant: "approve" }) as IVote),
    },
  ];

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex w-screen min-w-full max-w-full flex-col items-center">
      <ProposalHeader
        proposalNumber={Number(proposalId) + 1}
        proposal={proposal}
        breadcrumbs={breadcrumbs}
        tokenSupply={BigInt(0)}
        transactionConfirming={isConfirmingApproval || isConfirmingExecution}
        canExecute={canExecute}
        onExecutePressed={() => executeProposal()}
      />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySection body={proposal.description || "No description was provided"} />
            <ProposalVoting stages={proposalStage} />
            <ProposalAction
              onExecute={() => executeProposal()}
              isConfirmingExecution={isConfirmingExecution}
              canExecute={canExecute}
              actions={proposal.actions}
            />
          </div>
          <div className="flex flex-col gap-y-6 md:w-[33%]">
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
