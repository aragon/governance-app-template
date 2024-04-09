import { type ReactNode } from "react";
import { ElseIf, If, Then } from "@/components/if";
import { InputText, Tag } from "@aragon/ods";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { type Action } from "@/utils/types";
import { useAction } from "@/hooks/useAction";
import { type AbiFunction, type AbiParameter, type Address, type Hex, formatEther, toFunctionSignature } from "viem";
import { compactNumber } from "@/utils/numbers";
import { decodeCamelCase } from "@/utils/case";
import { type InputValue } from "@/utils/input-values";

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
  | boolean
  | CallParameterFieldType[]
  | { [k: string]: CallParameterFieldType };

export const ActionCard = function ({ action, idx }: ActionCardProps) {
  const { isLoading, args, functionName, functionAbi } = useAction(action);

  const isEthTransfer = !action.data || action.data === "0x";

  if (isEthTransfer) {
    return (
      <Card>
        <div className="flex w-full flex-row justify-between space-x-10">
          <div className="flex w-full flex-row space-x-10">
            <div>
              <h3 className="font-semibold">Recipient</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Transfer</h3>
              <p>{compactNumber(formatEther(action.value))} ETH</p>
            </div>
          </div>
          <Tag label={(idx + 1).toString()} variant="primary"></Tag>
        </div>
      </Card>
    );
  }

  const functionSignature = functionAbi ? toFunctionSignature(functionAbi).replace(/,/g, ", ") : "";

  return (
    <Card>
      <div className="flex w-full flex-row justify-between space-x-10">
        <div>
          <div className="flex w-full flex-row space-x-10">
            <div>
              <h3 className="font-semibold">Contract</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <If condition={!isLoading && functionName}>
              <div>
                <h3 className="font-semibold">Action</h3>
                <p className="text-ellipsis text-sm">
                  <code>{functionSignature}</code>
                </p>
              </div>
            </If>
            <If condition={action.value}>
              <div>
                <h3 className="font-semibold">Transfer</h3>
                <p>
                  <span className="font-semibold">{compactNumber(formatEther(action.value))}</span> ETH{" "}
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
              <h3 className="font-semibold">Action parameters</h3>
              <div className="mt-3 grid gap-3">
                {args.map((arg, i) => (
                  <CallParameterField value={arg} idx={i} key={i} functionAbi={functionAbi} />
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
      className="box-border flex w-full flex-col space-y-6 rounded-xl
      border border-neutral-100 bg-neutral-0
      p-4 focus:outline-none focus:ring
      focus:ring-primary lg:p-6"
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
  functionAbi: AbiFunction | null;
}) => {
  if (functionAbi?.type !== "function") return <></>;

  const addon = resolveAddon(functionAbi.inputs?.[idx].name ?? "", functionAbi.inputs?.[idx].type, idx);

  return (
    <InputText
      className="w-full"
      addon={decodeCamelCase(addon)}
      value={resolveValue(value, functionAbi.inputs?.[idx])}
      readOnly={true}
      addonPosition="left"
    />
  );
};

function resolveValue(value: CallParameterFieldType, abi?: AbiParameter): string {
  if (!abi?.type) {
    if (Array.isArray(value)) return value.join(", ");
    return value.toString();
  } else if (abi.type === "tuple[]") {
    const abiClone = Object.assign({}, { ...abi });
    abiClone.type = abiClone.type.replace(/\[\]$/, "");

    const items = (value as any as any[]).map((item) => resolveValue(item, abiClone));
    return items.join(", ");
  } else if (abi.type === "tuple") {
    const result = {} as Record<string, string>;
    const components: AbiParameter[] = (abi as any).components || [];

    for (let i = 0; i < components.length; i++) {
      const k = components[i].name!;
      result[k] = resolveValue((value as any)[k], components[i]);
    }

    return getReadableJson(result);
  } else if (abi.type.endsWith("[]")) {
    return (value as any as any[]).join(", ");
  } else if (abi.type === "address") {
    return value as string;
  } else if (abi.type === "bytes32") {
    return value as string;
  } else if (abi.type.startsWith("uint") || abi.type.startsWith("int")) {
    return value.toString();
  } else if (abi.type.startsWith("bool")) {
    return value ? "Yes" : "No";
  }
  return value.toString();
}

function resolveAddon(name: string, abiType: string | undefined, idx: number): string {
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

function getReadableJson(value: Record<string, InputValue>): string {
  const items = Object.keys(value).map((k) => `${k}: ${value[k]}`);

  return `{ ${items.join(", ")} }`;
}
