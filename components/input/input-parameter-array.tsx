import { useEffect, useState } from "react";
import { Button, InputText } from "@aragon/ods";
import { type AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import { type InputValue, handleStringValue, isValidStringValue, readableTypeName } from "@/utils/input-values";

interface IInputParameterArrayProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
}

export const InputParameterArray = ({ abi, idx, onChange }: IInputParameterArrayProps) => {
  const [value, setValue] = useState<Array<string | null>>([null]);
  const baseType = abi.type.replace(/\[\]$/, "");

  useEffect(() => {
    // Clean up if another function is selected
    setValue([null]);
  }, [abi, idx]);

  const onItemChange = (i: number, newVal: string) => {
    const newArray = ([] as Array<string | null>).concat(value);
    newArray[i] = newVal;
    setValue(newArray);

    const transformedItems = newArray.map((item) => handleStringValue(item ?? "", baseType));
    if (transformedItems.some((item) => item === null)) return;

    onChange(idx, transformedItems as InputValue[]);
  };

  const addMore = () => {
    const newValue = [...value, null];
    setValue(newValue);
  };

  return (
    <div className="mt-6">
      <p className="mb-3 text-base font-normal leading-tight text-neutral-800 md:text-lg">
        {abi.name ? decodeCamelCase(abi.name) : `Parameter ${idx + 1}`}
      </p>
      {value.map((item, i) => (
        <div key={i} className="flex">
          <InputText
            className={i > 0 ? "mt-3" : ""}
            addon={(i + 1).toString()}
            placeholder={baseType ? readableTypeName(baseType) : decodeCamelCase(abi.name) || ""}
            variant={item === null || isValidStringValue(item, baseType) ? "default" : "critical"}
            value={item ?? ""}
            onChange={(e) => onItemChange(i, e.target.value)}
          />
        </div>
      ))}
      <div className="mt-3 flex justify-end">
        <Button size="sm" variant="secondary" onClick={addMore}>
          Add more {!abi.name ? "" : decodeCamelCase(abi.name).toLowerCase()}
        </Button>
      </div>
    </div>
  );
};
