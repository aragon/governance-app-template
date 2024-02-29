import { FC, useState } from "react";
import { Address, Hex, encodeFunctionData } from "viem";
import { Button, InputText } from "@aragon/ods";
import { AbiFunction } from "abitype";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { isAddress } from "@/utils/evm";
import { Action } from "@/utils/types";
import { Else, ElseIf, If, Then } from "@/components/if";
import { useAbi } from "@/hooks/useAbi";
import { decodeCamelCase } from "@/utils/case";
import { useAlert } from "@/context/AlertContext";

interface FunctionEncodingFormProps {
  onAddAction: (action: Action) => any;
}
export const FunctionEncodingForm: FC<FunctionEncodingFormProps> = ({
  onAddAction,
}) => {
  const [targetContract, setTargetContract] = useState<string>("");
  const { abi, isLoading: loadingAbi } = useAbi(targetContract as Address);

  const actionEntered = (data: Hex, value: bigint) => {
    onAddAction({
      to: targetContract,
      value,
      data,
    });
  };

  return (
    <div className="my-6">
      <div className="mb-3 pb-3">
        <InputText
          className=""
          label="Contract address"
          placeholder="0x1234..."
          variant={
            !targetContract || isAddress(targetContract)
              ? "default"
              : "critical"
          }
          value={targetContract}
          onChange={(e) => setTargetContract(e.target.value || "")}
        />
      </div>
      <If condition={loadingAbi}>
        <Then>
          <div>
            <PleaseWaitSpinner />
          </div>
        </Then>
        <ElseIf condition={!targetContract}>
          <p>Enter the address of the contract to interact with</p>
        </ElseIf>
        <ElseIf condition={!isAddress(targetContract)}>
          <p>The address of the contract is not valid</p>
        </ElseIf>
        <ElseIf condition={!abi?.length}>
          <p>The ABI of the contract is not publicly available</p>
        </ElseIf>
        <Else>
          <FunctionSelector abi={abi} actionEntered={actionEntered} />
        </Else>
      </If>
    </div>
  );
};

const FunctionSelector = ({
  abi,
  actionEntered,
}: {
  abi: AbiFunction[];
  actionEntered: (calldata: Hex, value: bigint) => void;
}) => {
  const { addAlert } = useAlert();
  const [selectedAbiItem, setSelectedAbiItem] = useState<
    AbiFunction | undefined
  >();
  const [abiInputValues, setAbiInputValues] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");

  const onFunctionParameterChange = (idx: number, value: string) => {
    const newInputValues = [...abiInputValues];
    newInputValues[idx] = value;
    setAbiInputValues(newInputValues);
  };

  const onAddAction = () => {
    // Validate params
    if (!abi || !selectedAbiItem) return;

    let invalidParams = false;
    if (!abi?.length) invalidParams = true;
    else if (!selectedAbiItem?.name) invalidParams = true;
    else if (selectedAbiItem.inputs.length !== abiInputValues.length)
      invalidParams = true;

    for (const i in selectedAbiItem.inputs) {
      const item = selectedAbiItem.inputs[i];
      if (hasTypeError(abiInputValues[i], item.type)) {
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
      const args: any[] = [].concat(abiInputValues as any) as string[];
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

      setAbiInputValues([]);
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
      <div className="w-2/5 px-2 py-4 overflow-y-auto overflow-x-auto border-r border-neutral-200">
        <ul className="select-none space-y-1">
          {abi?.map((targetFunc, index) => (
            <li
              key={index}
              onClick={() => setSelectedAbiItem(targetFunc)}
              className={`w-full text-left font-sm hover:bg-neutral-100 py-2 px-3 rounded-xl hover:cursor-pointer ${targetFunc.name === selectedAbiItem?.name && "bg-neutral-100 font-semibold"}`}
            >
              {decodeCamelCase(targetFunc.name)}
              <If
                condition={["pure", "view"].includes(
                  targetFunc.stateMutability
                )}
              >
                <br />
                <span className="text-xs text-neutral-400">(read only)</span>
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
              {selectedAbiItem?.inputs.map((argument, i) => (
                <div key={i} className="mx-4 my-3">
                  <InputText
                    className=""
                    label={
                      argument.name
                        ? decodeCamelCase(argument.name)
                        : "Parameter " + (i + 1)
                    }
                    placeholder={
                      argument.type || decodeCamelCase(argument.name) || ""
                    }
                    variant={
                      hasTypeError(abiInputValues[i], argument.type)
                        ? "critical"
                        : "default"
                    }
                    value={abiInputValues[i] || ""}
                    onChange={(e) =>
                      onFunctionParameterChange(i, e.target.value)
                    }
                  />
                </div>
              ))}
              <If condition={selectedAbiItem?.payable}>
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

function hasTypeError(value: string, solidityType: string): boolean {
  if (!value || !solidityType) return false;

  switch (solidityType) {
    case "address":
      return !/^0x[0-9a-fA-F]{40}$/.test(value);
    case "bytes":
      return value.length % 2 !== 0 || !/^0x[0-9a-fA-F]*$/.test(value);
    case "string":
      return false;
    case "bool":
      return ![
        "true",
        "false",
        "True",
        "False",
        "yes",
        "no",
        "Yes",
        "No",
      ].includes(value);
    case "tuple":
      return false;
  }
  if (solidityType.match(/^bytes[0-9]{1,2}$/)) {
    return value.length % 2 !== 0 || !/^0x[0-9a-fA-F]+$/.test(value);
  } else if (solidityType.match(/^uint[0-9]+$/)) {
    return value.length % 2 !== 0 || !/^[0-9]*$/.test(value);
  } else if (solidityType.match(/^int[0-9]+$/)) {
    return value.length % 2 !== 0 || !/^-?[0-9]*$/.test(value);
  }
  return false;
}
