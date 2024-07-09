import { AccordionContainer, Card, Heading } from "@aragon/ods";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React from "react";
import { ITransformedStage } from "@/utils/types";
import { IVotingStageProps, VotingStage } from "@/components/proposalVoting";

dayjs.extend(utc);
dayjs.extend(relativeTime);

interface IProposalVotingProps {
  stages: ITransformedStage[];
}

export const L2ProposalVoting: React.FC<IProposalVotingProps> = ({ stages }) => {
  const stage = stages[0];
  return (
    <Card className="overflow-hidden rounded-xl bg-neutral-0 shadow-neutral">
      {/* Header */}
      <div className="flex flex-col gap-y-2 p-6">
        <Heading size="h2">L2 Voting</Heading>
        <p className="text-lg leading-normal text-neutral-500">
          This DAO supports crosschain voting. Votes must be dispatched back to the L1 before they can be recorded.
        </p>
      </div>
      {/* Stages */}
      <AccordionContainer isMulti={false} defaultValue="Stage 1" className="border-t border-t-neutral-100">
        <VotingStage key={stage.id} {...({ ...stage, number: 1 } as IVotingStageProps)} />
      </AccordionContainer>
    </Card>
  );
};
