import { useState } from "react";
import { Hex, encodeFunctionData } from "viem";
import { Button, InputText } from "@aragon/ods";
import { AbiFunction } from "abitype";
import { Else, If, Then } from "@/components/if";
import { decodeCamelCase } from "@/utils/case";
import { useAlertContext } from "@/context/AlertContext";
import { InputParameter } from "./input-parameter";
import { InputValue, isValidValue } from "@/utils/input-values";

interface IFunctionSelectorProps {
  abi: AbiFunction[];
  actionEntered: (calldata: Hex, value: bigint) => void;
}
export const FunctionSelector = ({
  abi,
  actionEntered,
}: IFunctionSelectorProps) => {
  const { addAlert } = useAlertContext();
  const [selectedAbiItem, setSelectedAbiItem] = useState<
    AbiFunction | undefined
  >();
  const [inputValues, setInputValues] = useState<InputValue[]>([]);
  const [value, setValue] = useState<string>("");

  const onParameterChange = (paramIdx: number, value: InputValue) => {
    const newInputValues = [...inputValues];
    newInputValues[paramIdx] = value;
    setInputValues(newInputValues);
  };

  const onAddAction = () => {
    // Validate params
    if (!abi || !selectedAbiItem) return;

    let invalidParams = false;
    if (!abi?.length) invalidParams = true;
    else if (!selectedAbiItem?.name) invalidParams = true;
    else if (selectedAbiItem.inputs.length !== inputValues.length)
      invalidParams = true;

    for (const i in selectedAbiItem.inputs) {
      const item = selectedAbiItem.inputs[i];
      if (!isValidValue(inputValues[i], item)) {
        invalidParams = true;
        break;
      }
    }
    invalidParams = invalidParams || !/^[0-9]*$/.test(value);

    if (invalidParams) {
      addAlert("Invalid parameters", {
        description: "Check that the parameters you entered are correct",
        type: "error",
      });
      return;
    }

    if (["pure", "view"].includes(selectedAbiItem.stateMutability)) {
      addAlert("Read only function", {
        description: "The action you have added will have no effect",
        timeout: 11 * 1000,
      });
    }

    try {
      const booleanIdxs = selectedAbiItem.inputs
        .map((inp, i) => (inp.type === "bool" ? i : -1))
        .filter((v) => v >= 0);
      const args: any[] = [].concat(inputValues as any) as string[];
      for (const i of booleanIdxs) {
        if (["false", "False", "no", "No"].includes(args[i])) args[i] = false;
        else args[i] = true;
      }

      const data = encodeFunctionData({
        abi,
        functionName: selectedAbiItem.name,
        args,
      });
      actionEntered(data, BigInt(value ?? "0"));

      setInputValues([]);
    } catch (err) {
      console.error(err);
      addAlert("Invalid parameters", {
        description: "Check that the parameters you entered are correct",
        type: "error",
      });
      return;
    }
  };

  return (
    <div className="flex h-96 bg-neutral-0 rounded-lg border border-neutral-200">
      {/* Side bar */}
      <div className="w-1/3 px-2 py-4 overflow-y-auto overflow-x-auto border-r border-neutral-200">
        <ul className="select-none space-y-1">
          {abi?.map((fn, index) => (
            <li
              key={index}
              onClick={() =>
                !["pure", "view"].includes(fn.stateMutability) &&
                setSelectedAbiItem(fn)
              }
              className={`w-full text-left font-sm hover:bg-neutral-100 py-2 px-3 rounded-xl hover:cursor-pointer ${fn.name === selectedAbiItem?.name && "bg-neutral-100 font-semibold"}`}
            >
              <If condition={!["pure", "view"].includes(fn.stateMutability)}>
                <Then>{decodeCamelCase(fn.name)}</Then>
                <Else>
                  <span className="line-through">
                    {decodeCamelCase(fn.name)}
                  </span>
                  <br />
                  <span className="text-xs text-neutral-400">(read only)</span>
                </Else>
              </If>
            </li>
          ))}
        </ul>
      </div>
      {/* Form */}
      <div className="w-2/3 bg-primary-50 rounded-r-lg py-4 overflow-y-auto">
        <If condition={!!selectedAbiItem}>
          <Then>
            <div className="">
              <div className="flex flex-row justify-between items-center mx-4 mb-3 pb-4 border-b border-neutral-200">
                <p className="text-lg font-semibold text-neutral-800">
                  <code>{decodeCamelCase(selectedAbiItem?.name)}</code>
                </p>
                <div className="ml-4 min-w-10">
                  <Button className="" size="sm" onClick={onAddAction}>
                    Add action
                  </Button>
                </div>
              </div>
              {/* Make titles smaller */}
              <style>{`
              label div p.leading-tight {
                font-size: 1rem;
              }
              `}</style>
              {selectedAbiItem?.inputs.map((paramAbi, i) => (
                <div key={i} className="mx-4 my-3">
                  <InputParameter
                    abi={paramAbi}
                    idx={i}
                    onChange={onParameterChange}
                  />
                </div>
              ))}
              <If
                condition={
                  selectedAbiItem?.stateMutability === "payable" ||
                  selectedAbiItem?.payable
                }
              >
                <div className="mx-4 my-3">
                  <InputText
                    className=""
                    label="Value (in wei)"
                    placeholder="1000000000000000000"
                    variant={value.match(/^[0-9]*$/) ? "default" : "critical"}
                    value={value}
                    onChange={(e) => setValue(e.target.value || "")}
                  />
                </div>
              </If>
            </div>
          </Then>
          <Else>
            <p className="ml-4 mt-2">Select a function from the list</p>
          </Else>
        </If>
      </div>
    </div>
  );
};
