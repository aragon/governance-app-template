import { type useProposal } from "@/plugins/multisig/hooks/useProposal";
import ProposalHeader from "@/plugins/multisig/components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalApprove } from "@/plugins/multisig/hooks/useProposalApprove";
import { useProposalExecute } from "@/plugins/multisig/hooks/useProposalExecute";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { ProposalVoting } from "@/components/proposalVoting";
import { type ITransformedStage, type IVote, ProposalStages } from "@/utils/types";
import { useProposalStatus } from "../hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { ProposalActions } from "@/components/proposalActions/proposalActions";
import { CardResources } from "@/components/proposal/cardResources";

export default function ProposalDetail({ id: proposalId }: { id: string }) {
  const {
    proposal,
    proposalFetchStatus,
    canApprove,
    approvals,
    isConfirming: isConfirmingApproval,
    approveProposal,
  } = useProposalApprove(proposalId);

  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalId);

  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const proposalStatus = useProposalStatus(proposal!);

  const proposalStage: ITransformedStage[] = [
    {
      id: "1",
      type: ProposalStages.MULTISIG_APPROVAL,
      variant: "approvalThreshold",
      title: "Onchain multisig",
      status: proposalStatus!,
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
                disabled: !canApprove,
                isLoading: isConfirmingApproval,
                label: "Approve",
                onClick: approveProposal,
              },
        approvalAmount: proposal?.approvals || 0,
        approvalThreshold: proposal?.parameters.minApprovals || 0,
      },
      details: {
        censusBlock: Number(proposal?.parameters.snapshotBlock),
        startDate: "",
        endDate: dayjs(Number(proposal?.parameters.expirationDate) * 1000).toString(),
        strategy: "Approval threshold",
        options: "Approve",
      },
      votes: approvals.map(({ approver }) => ({ address: approver, variant: "approve" }) as IVote),
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
      <ProposalHeader proposalId={proposalId} proposal={proposal} />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySection body={proposal.description || "No description was provided"} />
            <ProposalVoting
              stages={proposalStage}
              description="The onchain multisig flow allows its members to create proposals that, if approved, will be moved to the Optimistic Proposal stage."
            />
            <ProposalActions actions={proposal.actions} />
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
