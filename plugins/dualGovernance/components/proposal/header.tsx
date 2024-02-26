import { Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { AlertVariant } from "@aragon/ods";
import { ElseIf, If, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { useProposalVariantStatus } from "@/plugins/dualGovernance/hooks/useProposalVariantStatus";
import { PleaseWaitSpinner } from "@/components/please-wait";

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

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
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
            <span className="text-xl font-semibold text-neutral-700 pt-1">
              Proposal {proposalNumber}
            </span>
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
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="primary"
                onClick={() => onVetoPressed()}
              >
                Veto
              </Button>
            </ElseIf>
            <ElseIf condition={canExecute}>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="success"
                onClick={() => onExecutePressed()}
              >
                Execute
              </Button>
            </ElseIf>
          </If>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title || DEFAULT_PROPOSAL_TITLE}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by <AddressText>{proposal?.creator}</AddressText>
      </p>
    </div>
  );
};

export default ProposalHeader;
