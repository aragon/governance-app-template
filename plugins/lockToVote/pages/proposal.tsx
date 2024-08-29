import type { useProposal } from "../hooks/useProposal";
import ProposalHeader from "../components/proposal/header";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useProposalVeto } from "../hooks/useProposalVeto";
import { useProposalExecute } from "../hooks/useProposalExecute";
import { BodySection } from "@/components/proposal/proposalBodySection";
import { IBreakdownMajorityVotingResult, ProposalVoting } from "@/components/proposalVoting";
import type { ITransformedStage, IVote } from "@/utils/types";
import { ProposalStages } from "@/utils/types";
import { useProposalStatus } from "../hooks/useProposalVariantStatus";
import dayjs from "dayjs";
import { ProposalActions } from "@/components/proposalActions/proposalActions";
import { CardResources } from "@/components/proposal/cardResources";
import { Address, formatEther } from "viem";
import { useToken } from "../hooks/useToken";
import { usePastSupply } from "../hooks/usePastSupply";
import { ElseIf, If, Then } from "@/components/if";
import { AlertCard, ProposalStatus } from "@aragon/ods";
import { PUB_TOKEN_SYMBOL } from "@/constants";
import { useAccount } from "wagmi";
import { useTokenVotes } from "@/hooks/useTokenVotes";
import { ADDRESS_ZERO } from "@/utils/evm";
import { AddressText } from "@/components/text/address";
import Link from "next/link";

const ZERO = BigInt(0);

export default function ProposalDetail({ index: proposalIdx }: { index: number }) {
  const { address } = useAccount();
  const {
    proposal,
    proposalFetchStatus,
    canVeto,
    vetoes,
    isConfirming: isConfirmingVeto,
    vetoProposal,
  } = useProposalVeto(proposalIdx);
  const pastSupply = usePastSupply(proposal?.parameters.snapshotBlock);
  const { symbol: tokenSymbol } = useToken();
  const { balance, delegatesTo } = useTokenVotes(address);

  const { executeProposal, canExecute, isConfirming: isConfirmingExecution } = useProposalExecute(proposalIdx);

  const startDate = dayjs(Number(proposal?.parameters.startDate) * 1000).toString();
  const endDate = dayjs(Number(proposal?.parameters.endDate) * 1000).toString();

  const showProposalLoading = getShowProposalLoading(proposal, proposalFetchStatus);
  const proposalStatus = useProposalStatus(proposal!);
  let vetoPercentage = 0;
  if (proposal?.vetoTally && pastSupply && proposal.parameters.minVetoVotingPower) {
    vetoPercentage = Number(
      (BigInt(1000) * proposal.vetoTally) /
        ((pastSupply * BigInt(proposal.parameters.minVetoVotingPower)) / BigInt(10000000))
    );
  }

  let cta: IBreakdownMajorityVotingResult["cta"];
  if (proposal?.executed) {
    cta = {
      disabled: true,
      label: "Executed",
    };
  } else if (proposalStatus === ProposalStatus.ACCEPTED) {
    cta = {
      disabled: !canExecute || !proposal?.actions.length,
      isLoading: isConfirmingExecution,
      label: proposal?.actions.length ? "Execute" : "No actions to execute",
      onClick: executeProposal,
    };
  } else if (proposalStatus === ProposalStatus.ACTIVE) {
    cta = {
      disabled: !canVeto,
      isLoading: isConfirmingVeto,
      label: "Veto",
      onClick: vetoProposal,
    };
  }
  // TODO: CHECK has claimed + add claim()

  const proposalStage: ITransformedStage[] = [
    {
      id: "1",
      type: ProposalStages.OPTIMISTIC_EXECUTION,
      variant: "majorityVoting",
      title: "Optimistic voting",
      status: proposalStatus!,
      disabled: false,
      proposalId: proposalIdx.toString(),
      providerId: "1",
      result: {
        cta,
        votingScores: [
          {
            option: "Veto",
            voteAmount: formatEther(proposal?.vetoTally || BigInt(0)),
            votePercentage: vetoPercentage,
            tokenSymbol: tokenSymbol || PUB_TOKEN_SYMBOL,
          },
        ],
        proposalId: proposalIdx.toString(),
      },
      details: {
        censusTimestamp: Number(proposal?.parameters.snapshotBlock || 0) || 0,
        startDate,
        endDate,
        strategy: "Optimistic voting",
        options: "Veto",
      },
      votes: vetoes.map(({ voter }) => ({ address: voter, variant: "no" }) as IVote),
    },
  ];

  const hasBalance = !!balance && balance > ZERO;
  const delegatingToSomeoneElse = !!delegatesTo && delegatesTo !== address && delegatesTo !== ADDRESS_ZERO;
  const delegatedToZero = !!delegatesTo && delegatesTo === ADDRESS_ZERO;

  if (!proposal || showProposalLoading) {
    return (
      <section className="justify-left items-left flex w-screen min-w-full max-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex w-screen min-w-full max-w-full flex-col items-center">
      <ProposalHeader proposalIdx={proposalIdx} proposal={proposal} />

      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 md:px-16 md:pb-20 md:pt-10">
        <div className="flex w-full flex-col gap-x-12 gap-y-6 md:flex-row">
          <div className="flex flex-col gap-y-6 md:w-[63%] md:shrink-0">
            <BodySection body={proposal.description || "No description was provided"} />
            <If all={[hasBalance, delegatingToSomeoneElse || delegatedToZero]}>
              <NoVetoPowerWarning
                delegatingToSomeoneElse={delegatingToSomeoneElse}
                delegatesTo={delegatesTo}
                delegatedToZero={delegatedToZero}
                address={address}
                canVeto={canVeto}
              />
            </If>
            <ProposalVoting
              stages={proposalStage}
              description="Proposals become eventually executable, unless the community reaches the veto threshold during the community veto stage."
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

const NoVetoPowerWarning = ({
  delegatingToSomeoneElse,
  delegatesTo,
  delegatedToZero,
  address,
  canVeto,
}: {
  delegatingToSomeoneElse: boolean;
  delegatesTo: Address | undefined;
  delegatedToZero: boolean;
  address: Address | undefined;
  canVeto: boolean;
}) => {
  return (
    <AlertCard
      description={
        <span className="text-sm">
          <If true={delegatingToSomeoneElse}>
            <Then>
              You are currently delegating your voting power to <AddressText bold={false}>{delegatesTo}</AddressText>.
              If you wish to participate by yourself in future proposals,
            </Then>
            <ElseIf true={delegatedToZero}>
              You have not self delegated your voting power to participate in the DAO. If you wish to participate in
              future proposals,
            </ElseIf>
          </If>
          &nbsp;make sure that{" "}
          <Link href={"/plugins/members/#/delegates/" + address} className="!text-sm text-primary-400 hover:underline">
            your voting power is self delegated
          </Link>
          .
        </span>
      }
      message={
        delegatingToSomeoneElse
          ? "Your voting power is currently delegated"
          : canVeto
            ? "You cannot veto on new proposals"
            : "You cannot veto"
      }
      variant="info"
    />
  );
};

function getShowProposalLoading(
  proposal: ReturnType<typeof useProposal>["proposal"],
  status: ReturnType<typeof useProposal>["status"]
) {
  if (!proposal && status.proposalLoading) return true;
  else if (status.metadataLoading && !status.metadataError) return true;
  else if (!proposal?.title && !status.metadataError) return true;

  return false;
}
