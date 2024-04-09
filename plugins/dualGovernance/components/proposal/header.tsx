import { Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { AlertVariant } from "@aragon/ods";
import { ElseIf, If, Then, Else } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { useProposalVariantStatus } from "@/plugins/dualGovernance/hooks/useProposalVariantStatus";
import { PleaseWaitSpinner } from "@/components/please-wait";
import dayjs from "dayjs";

const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  canVeto: boolean;
  canExecute: boolean;
  transactionConfirming: boolean;
  onVetoPressed: () => void;
  onExecutePressed: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  proposal,
  canVeto,
  canExecute,
  transactionConfirming,
  onVetoPressed,
  onExecutePressed,
}) => {
  const proposalVariant = useProposalVariantStatus(proposal);
  const ended = proposal.parameters.endDate <= Date.now() / 1000;

  return (
    <div className="w-full">
      <div className="flex h-16 flex-row items-center pb-2">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200
             * text-info-800 text-success-800 text-critical-800
             */}
            <div className="flex">
              <Tag
                className="text-center text-critical-800"
                label={proposalVariant.label}
                variant={proposalVariant.variant as AlertVariant}
              />
            </div>
            <span className="pt-1 text-xl font-semibold text-neutral-700">Proposal {proposalNumber}</span>
          </div>
        </div>
        <div className="flex">
          <If condition={transactionConfirming}>
            <Then>
              <div>
                <PleaseWaitSpinner fullMessage="Confirming..." />
              </div>
            </Then>
            <ElseIf condition={canVeto}>
              <Button className="flex h-5 items-center" size="lg" variant="primary" onClick={() => onVetoPressed()}>
                Submit veto
              </Button>
            </ElseIf>
            <ElseIf condition={canExecute}>
              <Button className="flex h-5 items-center" size="lg" variant="success" onClick={() => onExecutePressed()}>
                Execute
              </Button>
            </ElseIf>
          </If>
        </div>
      </div>

      <h4 className="mb-1 flex-grow text-3xl font-semibold text-neutral-900">
        {proposal.title || DEFAULT_PROPOSAL_TITLE}
      </h4>
      <p className="text-l text-body-color dark:text-dark-6 text-base">
        Proposed by <AddressText>{proposal?.creator}</AddressText>,{" "}
        <If condition={ended}>
          <Then>ended on {dayjs(Number(proposal.parameters.endDate) * 1000).format("D MMM YYYY HH:mm")}h</Then>
          <Else>ending on {dayjs(Number(proposal.parameters.endDate) * 1000).format("D MMM YYYY HH:mm")}h</Else>
        </If>
      </p>
    </div>
  );
};

export default ProposalHeader;
