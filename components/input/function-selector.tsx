import { useEffect, useState } from "react";
import { type Hex, encodeFunctionData } from "viem";
import { AlertInline, Button, InputText } from "@aragon/ods";
import { type AbiFunction } from "abitype";
import { Else, If, Then } from "@/components/if";
import { decodeCamelCase } from "@/utils/case";
import { useAlerts } from "@/context/Alerts";
import { InputParameter } from "./input-parameter";
import { type InputValue } from "@/utils/input-values";
import { logger } from "@/services/logger";

interface IFunctionSelectorProps {
  abi: AbiFunction[];
  actionEntered: (calldata: Hex, value: bigint) => void;
}
export const FunctionSelector = ({ abi, actionEntered }: IFunctionSelectorProps) => {
  const { addAlert } = useAlerts();
  const [selectedAbiItem, setSelectedAbiItem] = useState<AbiFunction | undefined>();
  const [inputValues, setInputValues] = useState<InputValue[]>([]);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    // Clean up if another function is selected
    setInputValues([]);
  }, [abi]);

  const onParameterChange = (paramIdx: number, value: InputValue) => {
    const newInputValues = [...inputValues];
    newInputValues[paramIdx] = value;
    setInputValues(newInputValues);
  };

  const onAddAction = () => {
    if (!abi || !selectedAbiItem) return;

    // The values we have now are the result of
    // validation having happened at the specific components

    for (let i = 0; i < selectedAbiItem.inputs.length; i++) {
      if (inputValues[i] === null || inputValues[i] === undefined) {
        return addAlert("Invalid parameters", {
          description: "Make sure that you have filled all the parameters and that they contain valid values",
          type: "error",
        });
      }
    }

    try {
      const data = encodeFunctionData({
        abi,
        functionName: selectedAbiItem.name,
        args: inputValues,
      });
      actionEntered(data, BigInt(value ?? "0"));

      setInputValues([]);

      // Clean up the form
      setSelectedAbiItem(undefined);

      addAlert("New action added");
    } catch (err) {
      logger.error("Invalid parameters", err);
      addAlert("Invalid parameters", {
        description: "Check that the parameters you entered are correct",
        type: "error",
      });
      return;
    }
  };

  const functionAbiList = (abi || []).filter((item) => item.type === "function");

  return (
    <div className="flex h-96 rounded-lg border border-neutral-200 bg-neutral-0">
      {/* Side bar */}
      <div className="w-1/3 overflow-x-auto overflow-y-auto border-r border-neutral-200 px-2 py-4">
        <ul className="select-none space-y-1">
          {functionAbiList.map((fn, index) => (
            <li
              key={index}
              onClick={() => setSelectedAbiItem(fn)}
              className={`font-sm w-full rounded-xl px-3 py-2 text-left hover:cursor-pointer hover:bg-neutral-100 ${fn.name === selectedAbiItem?.name && "bg-neutral-100 font-semibold"}`}
            >
              <If condition={!["pure", "view"].includes(fn.stateMutability)}>
                <Then>{decodeCamelCase(fn.name)}</Then>
                <Else>
                  <span>{decodeCamelCase(fn.name)}</span>
                  <br />
                  <span className="text-xs text-neutral-300">(read only)</span>
                </Else>
              </If>
            </li>
          ))}
        </ul>
      </div>
      {/* Form */}
      <div className="w-2/3 overflow-y-auto rounded-r-lg bg-primary-50 py-4">
        <If condition={!!selectedAbiItem}>
          <Then>
            <div className="">
              <div className="mx-4 mb-3 flex flex-row items-center justify-between border-b border-neutral-200 pb-4">
                <p className="text-md mr-3 font-semibold text-neutral-800">
                  <code>{decodeCamelCase(selectedAbiItem?.name)}</code>
                </p>
                <div className="">
                  <Button className="!min-w-[110px]" size="sm" onClick={onAddAction}>
                    Add action
                  </Button>
                </div>
              </div>
              <If condition={["pure", "view"].includes(selectedAbiItem?.stateMutability ?? "")}>
                <div className="mx-4">
                  <AlertInline
                    message="This function is marked as read only. An action with it would have no impact"
                    variant="warning"
                  />
                </div>
              </If>
              {selectedAbiItem?.inputs.map((paramAbi, i) => (
                <div key={i} className="mx-4 my-3">
                  <InputParameter abi={paramAbi} idx={i} onChange={onParameterChange} />
                </div>
              ))}
              <If condition={selectedAbiItem?.stateMutability === "payable" || selectedAbiItem?.payable}>
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
