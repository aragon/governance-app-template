import { type useProposal } from "@/plugins/toucanVoting/hooks/useProposal";
import ProposalHeader from "@/plugins/toucanVoting/components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVoting } from "@/plugins/toucanVoting/hooks/useProposalVoting";
import { useProposalExecute } from "@/plugins/toucanVoting/hooks/useProposalExecute";
import { generateBreadcrumbs } from "@/utils/nav";
import { useRouter } from "next/router";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { ProposalVoting } from "@/components/proposalVoting";
import { type ITransformedStage, type IVote, ProposalStages } from "@/utils/types";
import { useProposalStatus } from "../hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { ProposalAction } from "@/components/proposalAction/proposalAction";
import { CardResources } from "@/components/proposal/cardResources";
import { compactNumber } from "@/utils/numbers";
import { formatEther } from "viem";
import DispatchVotes from "../components/bridge/DispatchVotes";
import { useVotingToken } from "../hooks/useVotingToken";
import { useGetProposalVotesL2 } from "../hooks/useProposalVotesL2";
import { L2ProposalVoting } from "../components/vote/L2Voting";
import { Card, Heading } from "@aragon/ods";
import { SplitRow } from "../components/bridge/SplitRow";
import { Proposal } from "../utils/types";

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
  const { symbol } = useVotingToken();
  const { l2Votes } = useGetProposalVotesL2(Number(proposalId));
  const tokenSymbol = symbol ?? "Votes";
  const breadcrumbs = generateBreadcrumbs(router.asPath);
  const proposalVariant = useProposalStatus(proposal!);
  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  const totalVotes = proposal?.tally.yes + proposal?.tally.no + proposal?.tally.abstain || 1n;

  const l2Yes = l2Votes?.yes || 0n;
  const l2No = l2Votes?.no || 0n;
  const l2Abstain = l2Votes?.abstain || 0n;
  const l2VotesTotal = l2Yes + l2No + l2Abstain;
  const l2Denominator = l2VotesTotal === 0n ? 1n : l2VotesTotal;

  // TODO: This is not revelant anymore
  const proposalStage: ITransformedStage[] = [
    {
      id: "1",
      type: ProposalStages.MAJORITY_VOTING,
      variant: "majorityVoting",
      title: "",
      status: proposalVariant!,
      disabled: false,
      proposalId,
      providerId: "1",
      result: {
        // @ts-expect-error ignoring for now
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
        votingScores: [
          {
            option: "Yes",
            voteAmount: compactNumber(formatEther(l2Votes?.yes || 0n), 2),
            votePercentage: Number((l2Yes / l2Denominator) * 100n),
            tokenSymbol,
          },
          {
            option: "No",
            voteAmount: compactNumber(formatEther(l2Votes?.yes || 0n), 2),
            votePercentage: Number((l2No / l2Denominator) * 100n),
            tokenSymbol,
          },
          {
            option: "Abstain",
            voteAmount: compactNumber(formatEther(l2Votes?.abstain || 0n), 2),
            votePercentage: Number((l2Abstain / l2Denominator) * 100n),
            tokenSymbol,
          },
        ],
      },
      details: {
        censusBlock: Number(proposal?.parameters.snapshotBlock),
        startDate: "",
        endDate: dayjs(Number(proposal?.parameters.endDate) * 1000).toString(),
        strategy: "Crosschain Majority Voting",
        options: "yes, no, abstain",
      },
      votes: votes && votes.map(({ voter: address }) => ({ address, variant: "approve" }) as IVote),
    },
  ];

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
            <L1ProposalSummary proposal={proposal} />
            <L2ProposalVoting stages={proposalStage} />
            {/* <ProposalVoting stages={proposalStage} /> */}
            <ProposalAction
              onExecute={() => executeProposal()}
              isConfirmingExecution={isConfirmingExecution}
              canExecute={canExecute}
              actions={proposal.actions}
            />
          </div>
          <div className="flex flex-col gap-y-6 md:w-[33%]">
            {/* Might be better to put a sentinel value here */}
            <DispatchVotes id={Number(proposalId ?? 0)} />
            {/* <CardResources resources={proposal.resources} title="Resources" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}

function L1ProposalSummary({ proposal }: { proposal: Proposal }) {
  const { symbol } = useVotingToken();
  const compactYes = compactNumber(formatEther(proposal.tally.yes), 2).concat(symbol ? ` ${symbol}` : "");
  const compactNo = compactNumber(formatEther(proposal.tally.no), 2).concat(symbol ? ` ${symbol}` : "");
  const compactAbstain = compactNumber(formatEther(proposal.tally.abstain), 2).concat(symbol ? ` ${symbol}` : "");
  return (
    <Card className="flex flex-col gap-4 p-4">
      <Heading size="h2">Total L1 Votes</Heading>
      <p className="text-lg leading-normal text-neutral-500">
        Votes recorded on the main L1 chain. All voting chains aggregate votes here and if the proposal passes, the DAO
        can execute.
      </p>
      <Card className="flex  flex-col gap-2 border-[1px] border-neutral-100 p-4">
        <SplitRow left="Yes" right={compactYes} />
        <SplitRow left="No" right={compactNo} />
        <SplitRow left="Abstain" right={compactAbstain} />
      </Card>
    </Card>
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
