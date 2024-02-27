import { ReactNode } from "react";
import { Else, ElseIf, If, Then } from "@/components/if";
import { InputText, Tag } from "@aragon/ods";
import { AddressText } from "@/components/text/address";
import { isAddress } from "@/utils/evm";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { Action } from "@/utils/types";
import { ABIFunction, useAction } from "@/hooks/useAction";
import { Address, Hex, formatEther, toHex } from "viem";
import { compactNumber } from "@/utils/numbers";

type ActionCardProps = {
  action: Action;
  idx: number;
};
type CallParameterFieldType =
  | string
  | number
  | bigint
  | Address
  | Hex
  | boolean;

export const ActionCard = function ({ action, idx }: ActionCardProps) {
  const { isLoading, args, functionName, functionSignature, functionAbi } =
    useAction(action);

  const isEthTransfer = !action.data || action.data === "0x";

  if (isEthTransfer) {
    return (
      <Card>
        <div className="w-full flex flex-row space-x-10 justify-between">
          <div className="w-full flex flex-row space-x-10">
            <div>
              <h3>Recipient</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <div>
              <h3>Transfer amount</h3>
              <p>
                <span className="font-semibold">
                  {compactNumber(formatEther(action.value))}
                </span>{" "}
                ETH{" "}
              </p>
            </div>
          </div>
          <Tag label={(idx + 1).toString()} variant="primary"></Tag>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="w-full flex flex-row space-x-10 justify-between">
        <div>
          <div className="w-full flex flex-row space-x-10">
            <div>
              <h3>Contract call</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <If condition={!isLoading && functionName}>
              <div>
                <h3>Action</h3>
                <p className="text-sm text-ellipsis">
                  <code>{functionSignature?.replace(/,/g, ", ")}</code>
                </p>
              </div>
            </If>
            <If condition={action.value}>
              <div>
                <h3>Transfer</h3>
                <p>
                  <span className="font-semibold">
                    {compactNumber(formatEther(action.value))}
                  </span>{" "}
                  ETH{" "}
                </p>
              </div>
            </If>
          </div>
        </div>
        <Tag label={(idx + 1).toString()} variant="primary"></Tag>
      </div>
      <If condition={isLoading}>
        <Then>
          <div className="mt-3">
            <PleaseWaitSpinner status="Loading the details" />
          </div>
        </Then>
        <ElseIf condition={args.length}>
          <div className="mt-3">
            <div>
              <h3>Action parameters</h3>
              <div className="grid gap-3 mt-3">
                {args.map((arg, i) => (
                  <CallParameterField
                    value={arg}
                    idx={i}
                    key={i}
                    functionAbi={functionAbi}
                  />
                ))}
              </div>
            </div>
          </div>
        </ElseIf>
      </If>
    </Card>
  );
};

// Helpers

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 lg:p-6 w-full flex flex-col space-y-6
      box-border border border-neutral-100
      focus:outline-none focus:ring focus:ring-primary
      bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

const CallParameterField = ({
  value,
  idx,
  functionAbi,
}: {
  value: CallParameterFieldType;
  idx: number;
  functionAbi: ABIFunction | null;
}) => {
  if (functionAbi?.type !== "function") return <></>;

  const addon = resolveAddon(
    functionAbi.inputs?.[idx].name ?? "",
    functionAbi.inputs?.[idx].type,
    idx
  );

  return (
    <InputText
      className="w-full"
      addon={addon}
      value={resolveValue(value, functionAbi.inputs?.[idx].type)}
      readOnly
      addonPosition="left"
    />
  );
};

function resolveValue(value: CallParameterFieldType, abiType?: string): string {
  if (!abiType) return value.toString();
  else if (abiType === "address") {
    return value.toString();
  } else if (abiType === "bytes32") {
    return toHex(value);
  } else if (abiType.startsWith("uint") || abiType.startsWith("int")) {
    return value.toString();
  } else if (abiType.startsWith("bool")) {
    return value ? "Yes" : "No";
  }
  return value.toString();
}

function resolveAddon(
  name: string,
  abiType: string | undefined,
  idx: number
): string {
  if (name) return name;
  else if (abiType) {
    if (abiType === "address") {
      return "Address";
    } else if (abiType === "bytes32") {
      return "Identifier";
    } else if (abiType === "bytes") {
      return "Data";
    } else if (abiType === "string") {
      return "Text";
    } else if (abiType.startsWith("uint") || abiType.startsWith("int")) {
      return "Number";
    } else if (abiType.startsWith("bool")) {
      return "Boolean";
    }
  }
  return (idx + 1).toString();
}
