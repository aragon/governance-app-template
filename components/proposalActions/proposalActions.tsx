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
  InputText,
} from "@aragon/ods";
import Link from "next/link";
import { CallFunctionSignatureField, CallParamField } from "./callParamField";
import { EncodedView } from "./encodedView";
import type { RawAction } from "@/utils/types";
import { Else, ElseIf, If, Then } from "../if";
import { useAction } from "@/hooks/useAction";
import { decodeCamelCase } from "@/utils/case";
import { formatEther } from "viem";

const DEFAULT_DESCRIPTION =
  "When the proposal passes the community vote, the following actions will be executable by the DAO.";
const DEFAULT_EMPTY_LIST_DESCRIPTION = "The proposal has no actions defined, it will behave as a signaling poll.";

interface IProposalActionsProps {
  description?: string;
  emptyListDescription?: string;
  actions?: RawAction[];
  onRemove?: (index: number) => any;
}

export const ProposalActions: React.FC<IProposalActionsProps> = (props) => {
  const { actions, description, emptyListDescription, onRemove } = props;

  let message: string;
  if (actions?.length) {
    message = description ? description : DEFAULT_DESCRIPTION;
  } else {
    message = emptyListDescription ? emptyListDescription : DEFAULT_EMPTY_LIST_DESCRIPTION;
  }

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-0 pb-2 shadow-neutral">
      {/* Header */}
      <div className="flex flex-col gap-y-2 px-4 py-4 md:gap-y-3 md:px-6 md:py-6">
        <div className="flex justify-between gap-x-2 gap-y-2">
          <p className="text-xl leading-tight text-neutral-800 md:text-2xl">Actions</p>
        </div>
        <p className="md:text-md text-base leading-normal text-neutral-500">{message}</p>
      </div>

      {/* Content */}
      <If lengthOf={actions} above={0}>
        <AccordionContainer isMulti={true} className="border-t border-t-neutral-100">
          {actions?.map((action, index) => (
            <ActionItem
              key={index}
              index={index}
              rawAction={action}
              onRemove={onRemove ? () => onRemove?.(index) : undefined}
            />
          ))}
        </AccordionContainer>
      </If>
    </div>
  );
};

const ActionItem = ({ index, rawAction, onRemove }: { index: number; rawAction: RawAction; onRemove?: () => any }) => {
  const action = useAction(rawAction);
  const title = `Action ${index + 1}`;
  const coinName = PUB_CHAIN.nativeCurrency.symbol;
  const isEthTransfer = !action.data || action.data === "0x";
  const functionName = isEthTransfer
    ? `Transfer ${coinName}`
    : decodeCamelCase(action.functionName || "(function call)");
  const functionAbi = action.functionAbi ?? null;
  const explorerUrl = `${PUB_CHAIN.blockExplorers?.default.url}/address/${action.to}`;

  return (
    <AccordionItem className="border-t border-t-neutral-100 bg-neutral-0" value={title}>
      <AccordionItemHeader className="!items-start">
        <div className="flex w-full gap-x-6">
          <div className="flex flex-1 flex-col items-start gap-y-2">
            <div className="flex">
              {/* Method name */}
              <span className="flex w-full text-left text-lg leading-tight text-neutral-800 md:text-xl">
                {functionName}
              </span>
            </div>
            <div className="flex w-full gap-x-6 text-sm leading-tight md:text-base">
              <Link href={explorerUrl} target="_blank">
                <span className="flex items-center gap-x-2 text-neutral-500">
                  {formatHexString(rawAction.to)}
                  <If true={functionAbi}>
                    <Then>
                      <AvatarIcon variant="primary" size="sm" icon={IconType.CHECKMARK} />
                    </Then>
                    <ElseIf not={isEthTransfer}>
                      <span className="flex items-center gap-x-2">
                        – &nbsp;Not Verified <AvatarIcon variant="warning" size="sm" icon={IconType.WARNING} />
                      </span>
                    </ElseIf>
                  </If>
                </span>
              </Link>
            </div>
          </div>
          <span className="hidden text-sm leading-tight text-neutral-500 sm:block md:text-base">{title}</span>
        </div>
      </AccordionItemHeader>

      <AccordionItemContent className="!overflow-none">
        <div className="flex flex-col gap-y-4">
          <If not={action?.functionAbi}>
            <Then>
              <EncodedView rawAction={rawAction} />
            </Then>
            <ElseIf not={action?.args?.length}>
              <CallFunctionSignatureField functionAbi={functionAbi} />
              <p>The action receives no parameters</p>
            </ElseIf>
            <Else>
              <CallFunctionSignatureField functionAbi={functionAbi} />
              {action?.args?.map((arg, i) => (
                <div className="flex" key={i}>
                  <CallParamField value={arg} idx={i} functionAbi={functionAbi} />
                </div>
              ))}
              <If val={action.value} above={BigInt(0)}>
                <InputText
                  label={coinName + " value"}
                  className="w-full"
                  value={formatEther(action.value ?? BigInt(0)) + " " + coinName}
                  disabled={true}
                />
              </If>
            </Else>
          </If>
          <If true={!!onRemove}>
            <div className="mt-2">
              <Button variant="tertiary" size="sm" iconLeft={IconType.CLOSE} onClick={onRemove}>
                Remove action
              </Button>
            </div>
          </If>
        </div>
      </AccordionItemContent>
    </AccordionItem>
  );
};
