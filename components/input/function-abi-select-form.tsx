import { type FC, useState } from "react";
import { AbiFunction, toFunctionSignature, type Address, type Hex } from "viem";
import { AlertInline, InputContainer, InputText } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { isAddress } from "@/utils/evm";
import { type RawAction } from "@/utils/types";
import { Else, ElseIf, If, Then } from "@/components/if";
import { useAbi } from "@/hooks/useAbi";
import { FunctionParamsForm } from "./function-params-form";
import { AddressText } from "../text/address";
import { decodeCamelCase } from "@/utils/case";

interface FunctionAbiSelectFormProps {
  onChange: (action: RawAction, abi: AbiFunction) => any;
  onActionCleared: () => any;
}
export const FunctionAbiSelectForm: FC<FunctionAbiSelectFormProps> = ({ onChange, onActionCleared }) => {
  const [targetContract, setTargetContract] = useState<string>("");
  const { abi, isLoading: loadingAbi, isProxy, implementation } = useAbi(targetContract as Address);
  const [selectedFunctionAbi, setSelectedFunctionAbi] = useState<AbiFunction | undefined>();

  const onActionChanged = (data: Hex, value: bigint) => {
    if (!targetContract || !selectedFunctionAbi) return;

    onChange(
      {
        to: targetContract as Address,
        value,
        data,
      },
      selectedFunctionAbi
    );
  };

  const functionAbiList = (abi || []).filter((item) => {
    if (["function"].includes(item.type)) return true;
    else if (["payable", "nonpayable"].includes(item.stateMutability)) return true;
    return false;
  });

  return (
    <div className="mt-4">
      <div className="mb-3">
        <InputText
          label="Contract address"
          placeholder="0x1234..."
          variant={!targetContract || isAddress(targetContract) ? "default" : "critical"}
          value={targetContract}
          onChange={(e) => {
            setTargetContract(e.target.value || "");
          }}
        />
      </div>
      <If true={loadingAbi}>
        <Then>
          <div>
            <PleaseWaitSpinner />
          </div>
        </Then>
        <ElseIf not={targetContract}>
          <p>Enter the address of the contract to call in a new action</p>
        </ElseIf>
        <ElseIf not={isAddress(targetContract || "")}>
          <AlertInline message="The given address is not valid" variant="critical" />
        </ElseIf>
        <ElseIf not={abi?.length}>
          <AlertInline
            message="Cannot find the public interface for the given address. Check that the address is a contract with a public ABI and that the contract exposes functions to be called."
            variant="critical"
          />
        </ElseIf>
        <Else>
          <If true={isProxy}>
            <p className="mb-6 text-sm opacity-80">
              The given contract is a proxy of <AddressText>{implementation}</AddressText>
            </p>
          </If>

          {/* Function select */}
          <If true={!selectedFunctionAbi}>
            <Then>
              <FunctionSelect
                functionAbiList={functionAbiList}
                onSelect={(functionAbi) => setSelectedFunctionAbi(functionAbi)}
              />
            </Then>
            <Else>
              <FunctionSelectorChange
                selectedFunctionAbi={selectedFunctionAbi}
                onClean={() => setSelectedFunctionAbi(undefined)}
              />
            </Else>
          </If>

          {/* Parameters form */}
          <FunctionParamsForm
            functionAbi={selectedFunctionAbi}
            onActionChanged={(calldata, value) => onActionChanged(calldata, value)}
            onActionCleared={() => onActionCleared()}
          />
        </Else>
      </If>
    </div>
  );
};

const FunctionSelectorChange = ({
  selectedFunctionAbi,
  onClean,
}: {
  selectedFunctionAbi?: AbiFunction;
  onClean: () => any;
}) => {
  if (!selectedFunctionAbi) return <></>;

  return (
    <InputContainer
      id="func-abi-select"
      label="Function"
      className="my-4 cursor-pointer"
      title="Click to select another function"
    >
      <div className="p-4 text-sm" onClick={onClean}>
        <code className="line-clamp-1 text-ellipsis">
          {selectedFunctionAbi ? toFunctionSignature(selectedFunctionAbi) : ""}
        </code>
      </div>
    </InputContainer>
  );
};

const FunctionSelect = ({
  functionAbiList,
  onSelect,
}: {
  functionAbiList: AbiFunction[];
  onSelect: (f: AbiFunction) => any;
}) => {
  const [showReadOnly, setShowReadOnly] = useState(false);
  const readonlyCount = functionAbiList.filter((f) => ["pure", "view"].includes(f.stateMutability)).length;

  return (
    <InputContainer id="func-abi-select" label="Select the function to call" className="my-4">
      <dl className="w-full divide-y divide-neutral-100">
        {functionAbiList.map((func, idx) => (
          <If true={!["pure", "view"].includes(func.stateMutability) || showReadOnly} key={idx}>
            <div
              onClick={() => onSelect(func)}
              className="flex cursor-pointer flex-col items-baseline gap-y-2 py-3 first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50 lg:gap-x-6 lg:py-4"
            >
              <dd className="size-full px-3 text-base leading-tight text-neutral-500">
                {decodeCamelCase(func.name)}
                <If true={["pure", "view"].includes(func.stateMutability)}>
                  {" "}
                  <span className="text-xs text-neutral-300">(read only)</span>
                </If>
              </dd>
            </div>
          </If>
        ))}
        <If true={!showReadOnly && readonlyCount > 0}>
          <div
            onClick={() => setShowReadOnly(true)}
            className="flex cursor-pointer flex-col items-baseline gap-y-2 py-3 first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50 lg:gap-x-6 lg:py-4"
          >
            <dd className="size-full px-3 text-base text-sm leading-tight text-neutral-300">
              Show read only methods ({readonlyCount})
            </dd>
          </div>
        </If>
      </dl>
    </InputContainer>
  );
};
