import { PUB_CHAIN } from "@/constants";
import { formatHexString } from "@/utils/evm";
import {
  AccordionContainer,
  AccordionItem,
  AccordionItemContent,
  AccordionItemHeader,
  AvatarIcon,
  Button,
  IconType,
} from "@aragon/ods";
import Link from "next/link";
import { CallParamField } from "./callParamField";
import { EncodedView } from "./encodedView";
import { RawAction } from "@/utils/types";
import { Else, If, Then } from "../if";
import { useAction } from "@/hooks/useAction";

interface IProposalActionProps {
  canExecute: boolean;
  isConfirmingExecution: boolean;
  onExecute: () => void;
  actions?: RawAction[];
}

export const ProposalAction: React.FC<IProposalActionProps> = (props) => {
  const { actions, canExecute, onExecute, isConfirmingExecution } = props;

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-0 pb-2 shadow-neutral">
      {/* Header */}
      <div className="flex flex-col gap-y-2 px-4 py-4 md:gap-y-3 md:px-6 md:py-6">
        <div className="flex justify-between gap-x-2 gap-y-2">
          <p className="text-xl leading-tight text-neutral-800 md:text-2xl">Actions</p>
          {canExecute && (
            <Button size="md" disabled={isConfirmingExecution} onClick={() => onExecute()} className="">
              Execute
            </Button>
          )}
        </div>
        <p className="text-base leading-normal text-neutral-500 md:text-lg">
          The proposal must pass all voting stages above before the binding onchain actions are able to be executed.
        </p>
      </div>

      {/* Content */}
      <AccordionContainer isMulti={true} className="border-t border-t-neutral-100">
        {actions?.map((action, index) => <ActionItem key={index} index={index} rawAction={action} />)}
      </AccordionContainer>
    </div>
  );
};

const ActionItem = ({ index, rawAction }: { index: number; rawAction: RawAction }) => {
  const action = useAction(rawAction);
  const title = `Action ${index + 1}`;
  const isEthTransfer = !action.data || action.data === "0x";
  const functionName = isEthTransfer ? "Withdraw assets" : action.functionName;
  const functionAbi = action.functionAbi ?? null;
  const explorerUrl = `${PUB_CHAIN.blockExplorers?.default.url}/address/${action.to}`;

  return (
    <AccordionItem className="border-t border-t-neutral-100 bg-neutral-0" value={title}>
      <AccordionItemHeader className="!items-start">
        <div className="flex w-full gap-x-6">
          <div className="flex flex-1 flex-col items-start gap-y-2">
            {functionName && (
              <div className="flex">
                {/* Method name */}
                <span className="flex w-full text-left text-lg leading-tight text-neutral-800 md:text-xl">
                  {functionName}
                </span>
              </div>
            )}
            <div className="flex w-full gap-x-6 text-sm leading-tight md:text-base">
              <Link href={explorerUrl} target="_blank">
                <span className="flex items-center gap-x-2 text-neutral-500">
                  {formatHexString(rawAction.to)}
                  {functionName != null && <AvatarIcon variant="primary" size="sm" icon={IconType.CHECKMARK} />}
                  {functionName == null && (
                    <span className="flex items-center gap-x-2">
                      Not Verified <AvatarIcon variant="warning" size="sm" icon={IconType.WARNING} />
                    </span>
                  )}
                </span>
              </Link>
            </div>
          </div>
          <span className="hidden text-sm leading-tight text-neutral-500 sm:block md:text-base">{title}</span>
        </div>
      </AccordionItemHeader>

      <AccordionItemContent className="!overflow-none">
        <div className="flex flex-col gap-y-4">
          <If condition={!action?.args?.length}>
            <Then>
              <EncodedView rawAction={action} />
            </Then>
            <Else>
              {action?.args?.map((arg, i) => (
                <div className="flex" key={i}>
                  <CallParamField value={arg} idx={i} functionAbi={functionAbi} />
                </div>
              ))}
            </Else>
          </If>
        </div>
      </AccordionItemContent>
    </AccordionItem>
  );
};
