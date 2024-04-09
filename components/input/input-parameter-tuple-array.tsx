import { useEffect, useState } from "react";
import { AlertInline, Button, Tag } from "@aragon/ods";
import { type AbiParameter } from "viem";
import { type InputValue } from "@/utils/input-values";
import { InputParameterTuple } from "./input-parameter-tuple";
import { decodeCamelCase } from "@/utils/case";
import { Else, If, Then } from "../if";

interface IInputParameterTupleArrayProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: Array<Record<string, InputValue>>) => any;
}

export const InputParameterTupleArray = ({ abi, idx, onChange }: IInputParameterTupleArrayProps) => {
  const [values, setValues] = useState<Array<Record<string, InputValue> | undefined>>([undefined]);

  useEffect(() => {
    // Clean up if another function is selected
    setValues([undefined]);
  }, [abi, idx]);

  const onItemChange = (i: number, newVal: Record<string, InputValue>) => {
    const newValues = [...values];
    newValues[i] = newVal;
    setValues(newValues);

    if (newValues.some((item) => !item)) return;

    onChange(idx, newValues as Array<Record<string, InputValue>>);
  };

  const addMore = () => {
    const newValues = [...values, undefined];
    setValues(newValues);
  };

  const components: AbiParameter[] = (abi as any).components || [];
  const someMissingName = components.some((c) => !c.name);

  return (
    <div>
      <If not={someMissingName}>
        <Then>
          {values.map((_, i) => (
            <div key={i} className="mt-6">
              <div className="flex justify-between">
                <p className="mb-3 text-base font-normal leading-tight text-neutral-800 md:text-lg">
                  {abi.name ? decodeCamelCase(abi.name) : `Parameter ${idx + 1}`}
                </p>
                <Tag label={(i + 1).toString()} variant="primary" />
              </div>

              <InputParameterTuple abi={abi} idx={i} onChange={onItemChange} hideTitle={true} />
            </div>
          ))}
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="secondary" onClick={addMore}>
              Add more {!abi.name ? "" : decodeCamelCase(abi.name).toLowerCase()}
            </Button>
          </div>
        </Then>
        <Else>
          <p className="mb-3 text-base font-normal leading-tight text-neutral-800 md:text-lg">
            {abi.name ? decodeCamelCase(abi.name) : `Parameter ${idx + 1}`}
          </p>
          <AlertInline
            message={`Cannot display the input fields${
              !abi.name ? "" : ` for ${decodeCamelCase(abi.name).toLowerCase()}`
            }. The function definition is incomplete.`}
            variant="critical"
          />
        </Else>
      </If>
    </div>
  );
};
