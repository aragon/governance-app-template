import { InputText } from "@aragon/ods";
import { AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import {
  InputValue,
  isValidStringValue,
  handleStringValue,
} from "@/utils/input-values";
import { useState } from "react";

interface IInputParameterTextProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
}

export const InputParameterText = ({
  abi,
  idx,
  onChange,
}: IInputParameterTextProps) => {
  const [value, setvalue] = useState("");

  const handleValue = (val: string) => {
    setvalue(val);

    const parsedValue = handleStringValue(val, abi.type);
    if (parsedValue === null) return;

    onChange(idx, parsedValue);
  };

  return (
    <div className="flex">
      <InputText
        name={
          "abi-input-" + idx + "-" + (abi.name || abi.internalType || abi.type)
        }
        addon={abi.name ? decodeCamelCase(abi.name) : "Parameter " + (idx + 1)}
        placeholder={abi.type || decodeCamelCase(abi.name) || ""}
        variant={
          !value || isValidStringValue(value, abi.type) ? "default" : "critical"
        }
        value={value}
        onChange={(e) => handleValue(e.target.value)}
      />
    </div>
  );
};
