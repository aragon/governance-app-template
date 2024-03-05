import { useState } from "react";
import { AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import { InputParameter } from "./input-parameter";
import { InputValue } from "@/utils/input-values";
import { If } from "../if";

interface IInputParameterTupleProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
  hideTitle?: boolean;
}

export const InputParameterTuple = ({
  abi,
  idx,
  onChange,
  hideTitle,
}: IInputParameterTupleProps) => {
  const [value, setValue] = useState<Record<string, string>>({});
  // const ohChange = (idx: number, value: string) => {
  //   const newInputValues = [...abiInputValues];
  //   newInputValues[idx] = value;
  //   setAbiInputValues(newInputValues);
  // };

  const components: AbiParameter[] = (abi as any).components || [];

  return (
    <div>
      <If condition={!hideTitle}>
        <p className="text-base font-normal leading-tight text-neutral-800 md:text-md mb-3">
          {abi.name ? decodeCamelCase(abi.name) : "Parameter " + (idx + 1)}
        </p>
      </If>

      <div className="ml-6">
        {components.map((item, i) => (
          <div key={i} className="mb-3">
            <InputParameter abi={item} idx={i} onChange={console.log} />
          </div>
        ))}
      </div>
    </div>
  );
};
