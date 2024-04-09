import { useEffect, useState } from "react";
import { type AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import { InputParameter } from "./input-parameter";
import { type InputValue } from "@/utils/input-values";
import { Else, If, Then } from "../if";
import { AlertInline } from "@aragon/ods";

interface IInputParameterTupleProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: Record<string, InputValue>) => any;
  hideTitle?: boolean;
}

export const InputParameterTuple = ({ abi, idx, onChange, hideTitle }: IInputParameterTupleProps) => {
  const [values, setValues] = useState<Array<InputValue | undefined>>([]);

  useEffect(() => {
    // Clean up if another function is selected
    setValues([]);
  }, [abi, idx]);

  const onItemChange = (i: number, newVal: InputValue) => {
    const newValues = [...values];
    newValues[i] = newVal;
    setValues(newValues);

    // Report up
    const result: Record<string, InputValue> = {};

    for (let i = 0; i < components.length; i++) {
      // Skip if incomplete
      if (newValues[i] === undefined || newValues[i] === null) return;
      // Arrange as an object
      result[components[i].name!] = newValues[i]!;
    }

    onChange(idx, result);
  };

  const components: AbiParameter[] = (abi as any).components || [];
  const someMissingName = components.some((c) => !c.name);

  return (
    <div>
      <If not={hideTitle}>
        <p className="mb-3 text-base font-normal leading-tight text-neutral-800 md:text-lg">
          {abi.name ? decodeCamelCase(abi.name) : `Parameter ${idx + 1}`}
        </p>
      </If>

      <If not={someMissingName}>
        <Then>
          <div className="ml-6">
            {components.map((item, i) => (
              <div key={i} className="mb-3">
                <InputParameter abi={item} idx={i} onChange={onItemChange} />
              </div>
            ))}
          </div>
        </Then>
        <Else>
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
