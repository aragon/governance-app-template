import { PUB_CHAIN } from "@/constants";
import { getSimpleRelativeTimeFromDate } from "@/utils/dates";
import { AccordionItem, AccordionItemContent, AccordionItemHeader, Heading, Tabs } from "@aragon/ods";
import { Tabs as RadixTabsRoot } from "@radix-ui/react-tabs";
import dayjs from "dayjs";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { VotingBreakdown, type IBreakdownMajorityVotingResult, type ProposalType } from "../votingBreakdown";
import { type IBreakdownApprovalThresholdResult } from "../votingBreakdown/approvalThresholdResult";
import { VotingDetails } from "../votingDetails";
import { VotingStageStatus } from "./votingStageStatus";
import type { IVote, IVotingStageDetails, ProposalStages } from "@/utils/types";
import { VotesDataList } from "../votesDataList/votesDataList";

export interface IVotingStageProps<TType extends ProposalType = ProposalType> {
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

export const VotingStage: React.FC<IVotingStageProps> = (props) => {
  const { details, disabled, title, number, result, proposalId = "", status, variant, votes } = props;

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

  const defaultTab = status === "active" ? "breakdown" : "breakdown";
  const stageKey = `Stage ${number}`;
  const snapshotTakenAt = details?.censusBlock
    ? `Block ${details.censusBlock}`
    : details?.censusTimestamp
      ? dayjs(details.censusTimestamp * 1000).toString()
      : "";
  const snapshotBlockURL = details?.censusBlock
    ? `${PUB_CHAIN.blockExplorers?.default.url}/block/${details?.censusBlock}`
    : "";

  return (
    <AccordionItem
      key={stageKey}
      value={stageKey}
      disabled={disabled}
      className="border-t border-t-neutral-100 bg-neutral-0"
    >
      <AccordionItemHeader className="!items-start !gap-y-5">
        <div className="flex w-full gap-x-6">
          <div className="flex flex-1 flex-col items-start gap-y-2">
            <Heading size="h3" className="line-clamp-1 text-left">
              {title}
            </Heading>
            <VotingStageStatus status={status} endDate={getSimpleRelativeTimeFromDate(dayjs(details?.endDate))} />
          </div>
          <span className="hidden leading-tight text-neutral-500 sm:block">{stageKey}</span>
        </div>
      </AccordionItemHeader>

      <AccordionItemContent ref={contentRef} className="!md:pb-0 !pb-0">
        <RadixTabsRoot defaultValue={defaultTab} ref={setRef}>
          <Tabs.List>
            <Tabs.Trigger value="breakdown" label="Breakdown" />
            <Tabs.Trigger value="votes" label="Votes" />
            <Tabs.Trigger value="details" label="Details" />
          </Tabs.List>
          <Tabs.Content value="breakdown">
            <div className="py-4 pb-8">
              {result && <VotingBreakdown cta={result.cta} variant={variant} result={result} />}
            </div>
          </Tabs.Content>
          <Tabs.Content value="votes">
            <div className="py-4 pb-8">
              <VotesDataList votes={votes || []} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="details">
            <div className="py-4 pb-8">
              {details && (
                <VotingDetails
                  startDate={details.startDate}
                  endDate={details.endDate}
                  snapshotTakenAt={snapshotTakenAt}
                  snapshotBlockURL={snapshotBlockURL}
                  tokenAddress={details.tokenAddress}
                  strategy={details.strategy}
                  options={details.options}
                />
              )}
            </div>
          </Tabs.Content>
        </RadixTabsRoot>
      </AccordionItemContent>
    </AccordionItem>
  );
};
