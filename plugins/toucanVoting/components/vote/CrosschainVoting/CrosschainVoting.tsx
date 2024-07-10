import {
  IBreakdownApprovalThresholdResult,
  IBreakdownMajorityVotingResult,
  VotesDataList,
  VotingDetails,
} from "@/components/proposalVoting";
import { VotingStageStatus } from "@/components/proposalVoting/votingStage/votingStageStatus";
import { PUB_CHAIN, PUB_CHAIN_NAME, PUB_L2_CHAIN_NAME } from "@/constants";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { IVote, ProposalStages } from "@/utils/types";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemHeader,
  Heading,
  ProposalType,
  Tabs,
  formatterUtils,
} from "@aragon/ods";
import { Tabs as RadixTabsRoot } from "@radix-ui/react-tabs";
import dayjs from "dayjs";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { CrossChainMajorityVotingResult } from "./CrosschainMajorityVotingResult";
import { readableChainName } from "@/utils/chains";
import { useL1ProposalStage } from "@/plugins/toucanVoting/hooks/useL1ProposalStage";
import { useL2ProposalStage } from "@/plugins/toucanVoting/hooks/useL2ProposalStage";

export interface IVotingStageDetails {
  censusBlock: number;
  startDate: string;
  endDate: string;
  strategy: string;
  options: string;
}

export interface ICrossChainVotingProps {
  proposalId: string;
}

export interface IVotingStage<TType extends ProposalType = ProposalType> {
  title: string;
  number: number;
  disabled: boolean;
  status: "accepted" | "rejected" | "active";

  variant: TType;
  proposalId?: string;
  result?: TType extends "approvalThreshold" ? IBreakdownApprovalThresholdResult : IBreakdownMajorityVotingResult;
  details?: IVotingStageDetails;
  votes?: IVote[];
}

export const CrossChainVoting: React.FC<ICrossChainVotingProps> = ({ proposalId }) => {
  const l1 = useL1ProposalStage(proposalId);
  const l2 = useL2ProposalStage(proposalId);

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Callback ref to capture the portalled node when it is available
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setNode(node);
    }
  }, []);

  const resize = useCallback(() => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = `${entry.contentRect.height}px`;
          const oldHeight = contentRef.current?.style["--radix-collapsible-content-height" as any];

          // Only update if the height has actually changed
          if (oldHeight !== newHeight) {
            requestAnimationFrame(() => {
              contentRef.current?.style.setProperty("--radix-collapsible-content-height", newHeight);
            });
          }
        }
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [node]);

  useLayoutEffect(resize, [resize]);

  const defaultTab = l1.status === "active" ? "breakdown" : "breakdown";
  const formattedSnapshotBlock = formatterUtils.formatNumber(l1.details?.censusBlock) ?? "";
  const snapshotBlockURL = `${PUB_CHAIN.blockExplorers?.default.url}/block/${l1.details?.censusBlock}`;

  const l1Label = "Votes " + readableChainName(PUB_CHAIN_NAME).split(" ")[0];
  const l2Label = "Votes " + readableChainName(PUB_L2_CHAIN_NAME).split(" ")[0];

  return (
    <AccordionItem value="1" disabled={l1.disabled} className="border-t border-t-neutral-100 bg-neutral-0">
      <AccordionItemHeader className="!items-start !gap-y-5">
        <div className="flex w-full gap-x-6">
          <div className="flex flex-1 flex-col items-start gap-y-2">
            <Heading size="h3" className="line-clamp-1 text-left">
              {l1.title}
            </Heading>
            <VotingStageStatus
              // todo remove any
              status={l1.status as any}
              endDate={getSimpleRelativeTimeFromDate(dayjs(l1.details?.endDate))}
            />
          </div>
        </div>
      </AccordionItemHeader>

      <AccordionItemContent ref={contentRef} asChild={true} className="!md:pb-0 !pb-0">
        <RadixTabsRoot defaultValue={defaultTab} ref={setRef}>
          <Tabs.List>
            <Tabs.Trigger value="breakdown" label="Breakdown" />
            <Tabs.Trigger value="l1Votes" label={l1Label} />
            <Tabs.Trigger value="l2Votes" label={l2Label} />
            <Tabs.Trigger value="details" label="Details" />
          </Tabs.List>
          <Tabs.Content value="breakdown" asChild={true}>
            <div className="py-4 pb-8">{l1.result && <CrossChainMajorityVotingResult proposalId={proposalId} />}</div>
          </Tabs.Content>
          <Tabs.Content value="l1Votes">
            <div className="py-4 pb-8">
              <VotesDataList votes={l1.votes || []} proposalId={proposalId} stageTitle={l1.title as ProposalStages} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="l2Votes">
            <div className="py-4 pb-8">
              <VotesDataList votes={l2.votes || []} proposalId={proposalId} stageTitle={l1.title as ProposalStages} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="details">
            <div className="py-4 pb-8">
              {l1.details && (
                <VotingDetails
                  snapshotBlock={formattedSnapshotBlock}
                  startDate={l1.details.startDate ?? ""}
                  endDate={l1.details.endDate ?? ""}
                  snapshotBlockURL={snapshotBlockURL}
                  strategy={l1.details.strategy ?? ""}
                  options={l1.details.options ?? ""}
                />
              )}
            </div>
          </Tabs.Content>
        </RadixTabsRoot>
      </AccordionItemContent>
    </AccordionItem>
  );
};
