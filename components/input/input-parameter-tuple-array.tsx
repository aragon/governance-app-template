import { useState } from "react";
import { Button, Tag } from "@aragon/ods";
import { AbiParameter } from "viem";
import {
  InputValue,
  handleStringValue,
  isValidStringValue,
} from "@/utils/input-values";
import { InputParameterTuple } from "./input-parameter-tuple";
import { decodeCamelCase } from "@/utils/case";

interface IInputParameterTupleArrayProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
}

export const InputParameterTupleArray = ({
  abi,
  idx,
  onChange,
}: IInputParameterTupleArrayProps) => {
  const [value, setValue] = useState<string[][]>([[]]);

  const onItemChange = (i: number, newVal: InputValue) => {
    console.log(i, newVal);

    // const newArray = ([] as string[][]).concat(value);
    // newArray[i] = newVal;
    // setValue(newArray);
    // const transformedItems = newArray.map((item) =>
    //   handleStringValue(item, abi.type)
    // );
    // if (transformedItems.some((item) => item === null)) return;
    // onChange(idx, transformedItems as InputValue[]);
  };

  const addMore = () => {
    const newValue = [...value, []];
    setValue(newValue);
  };

  return (
    <div>
      {value.map((_, i) => (
        <div className="mt-6">
          <div className="flex justify-between">
            <p className="text-base font-normal leading-tight text-neutral-800 md:text-lg mb-3">
              {abi.name ? decodeCamelCase(abi.name) : "Parameter " + (idx + 1)}
            </p>
            <Tag label={(i + 1).toString()} variant="primary" />
          </div>

          <InputParameterTuple
            abi={abi}
            idx={i}
            onChange={onItemChange}
            hideTitle
          />
        </div>
      ))}
      <div className="flex justify-end mt-3">
        <Button size="sm" variant="secondary" onClick={addMore}>
          Add more
        </Button>
      </div>
    </div>
  );
};
