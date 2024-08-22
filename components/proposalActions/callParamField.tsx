import { decodeCamelCase } from "@/utils/case";
import { InputText } from "@aragon/ods";
import { toFunctionSignature, type AbiFunction } from "viem";
import { resolveFieldTitle, resolveParamValue, type CallParameterFieldType } from "@/utils/abi-helpers";

interface ICallParamFiledProps {
  value: CallParameterFieldType;
  idx: number;
  functionAbi: AbiFunction | null;
}
interface ICallFunctionSignatureFieldProps {
  functionAbi: AbiFunction | null;
}

export const CallParamField: React.FC<ICallParamFiledProps> = ({ value, idx, functionAbi }) => {
  if (functionAbi?.type !== "function") return;

  const resolvedValue = resolveParamValue(value, functionAbi.inputs?.[idx]);
  const label = resolveFieldTitle(functionAbi.inputs?.[idx].name ?? "", functionAbi.inputs?.[idx].type, idx);

  return <InputText label={decodeCamelCase(label)} className="w-full" value={resolvedValue} disabled={true} />;
};

export const CallFunctionSignatureField: React.FC<ICallFunctionSignatureFieldProps> = ({ functionAbi }) => {
  if (functionAbi?.type !== "function") return;

  const sig = toFunctionSignature(functionAbi);

  return <InputText label="Contract function" className="w-full" value={sig} disabled={true} />;
};
