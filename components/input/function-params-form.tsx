import { useEffect, useState } from "react";
import { type Hex, encodeFunctionData, parseEther } from "viem";
import { AlertInline, InputNumber } from "@aragon/ods";
import { type AbiFunction } from "abitype";
import { If } from "@/components/if";
import { InputParameter } from "./input-parameter";
import { type InputValue } from "@/utils/input-values";
import { PUB_CHAIN } from "@/constants";

interface IFunctionParamsFormProps {
  functionAbi?: AbiFunction;
  onActionChanged: (calldata: Hex, value: bigint, abi: AbiFunction) => void;
  onActionCleared: () => any;
  onSubmit?: () => any;
}
export const FunctionParamsForm = ({
  functionAbi,
  onActionChanged,
  onActionCleared,
  onSubmit,
}: IFunctionParamsFormProps) => {
  const coinName = PUB_CHAIN.nativeCurrency.symbol;
  const [inputValues, setInputValues] = useState<InputValue[]>([]);
  const [value, setValue] = useState<string>("");

  const canSend = (() => {
    if (!functionAbi) return false;

    for (let i = 0; i < functionAbi.inputs.length; i++) {
      if (inputValues[i] === null || inputValues[i] === undefined) {
        return false;
      }
    }
    return true;
  })();

  useEffect(() => {
    // Clean up if another function is selected
    setInputValues([]);
  }, [functionAbi]);

  useEffect(() => {
    // Attempt to sync when possible
    trySubmit();
  }, [functionAbi, inputValues.join(","), value, canSend]);

  const onParameterChange = (paramIdx: number, value: InputValue) => {
    const newInputValues = [...inputValues];
    newInputValues[paramIdx] = value;
    setInputValues(newInputValues);
  };

  const trySubmit = () => {
    if (!functionAbi || !canSend) {
      onActionCleared();
      return;
    }

    try {
      const data = encodeFunctionData({
        abi: [functionAbi],
        functionName: functionAbi.name,
        args: inputValues,
      });
      onActionChanged(data, BigInt(value ?? "0"), functionAbi);
    } catch (err) {
      console.error("Invalid parameters", err);
      onActionCleared();
    }
  };

  return (
    <div className="w-full rounded-r-lg pt-4">
      <If true={functionAbi?.inputs.length || 0 > 0}>
        <div className="flex flex-row items-center justify-between border-b border-neutral-200 pb-4">
          <p className="text-md font-semibold text-neutral-800">Parameters</p>
        </div>
      </If>
      {functionAbi?.inputs.map((paramAbi, i) => (
        <div key={i} className=" my-3">
          <InputParameter abi={paramAbi} idx={i} onChange={onParameterChange} />
        </div>
      ))}
      <If true={functionAbi?.stateMutability === "payable" || !!functionAbi?.payable}>
        <div className="my-4">
          <InputNumber
            label={`${coinName} amount (optional)`}
            placeholder="1.234"
            min={0}
            onChange={(val: string) => setValue(parseEther(val).toString())}
            onKeyDown={(e) => (e.key === "Enter" ? onSubmit?.() : null)}
          />
        </div>
      </If>
      <If true={["pure", "view"].includes(functionAbi?.stateMutability ?? "")}>
        <div className="mt-2">
          <AlertInline
            message="This method is marked as read only. An action calling it should have no impact."
            variant="warning"
          />
        </div>
      </If>
    </div>
  );
};
