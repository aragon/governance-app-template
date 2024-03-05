import { useState } from "react";
import { Button, InputText } from "@aragon/ods";
import { AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import {
  InputValue,
  handleStringValue,
  isValidStringValue,
} from "@/utils/input-values";

interface IInputParameterArrayProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
}

export const InputParameterArray = ({
  abi,
  idx,
  onChange,
}: IInputParameterArrayProps) => {
  const [value, setValue] = useState([""]);

  const onItemChange = (i: number, newVal: string) => {
    const newArray = ([] as string[]).concat(value);
    newArray[i] = newVal;
    setValue(newArray);

    const transformedItems = newArray.map((item) =>
      handleStringValue(item, abi.type)
    );
    if (transformedItems.some((item) => item === null)) return;

    onChange(idx, transformedItems as InputValue[]);
  };

  const addMore = () => {
    const newValue = [...value, ""];
    setValue(newValue);
  };

  return (
    <div>
      {value.map((item, i) => (
        <InputText
          className={i > 0 ? "mt-3" : ""}
          label={
            i === 0
              ? (abi.name
                  ? decodeCamelCase(abi.name)
                  : "Parameter " + (i + 1)) + " (list)"
              : undefined
          }
          placeholder={
            abi.type?.replace(/\[\]$/, "") || decodeCamelCase(abi.name) || ""
          }
          variant={
            isValidStringValue(item[i], abi.type) ? "default" : "critical"
          }
          value={item[i] || ""}
          onChange={(e) => onItemChange(i, e.target.value)}
        />
      ))}
      <div className="flex justify-end mt-3">
        <Button size="sm" variant="secondary" onClick={addMore}>
          Add more
        </Button>
      </div>
    </div>
  );
};
