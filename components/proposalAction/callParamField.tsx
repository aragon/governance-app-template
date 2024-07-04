import { decodeCamelCase } from "@/utils/case";
import { InputText } from "@aragon/ods";
import { type AbiFunction } from "viem";
import { resolveAddon, resolveValue, type CallParameterFieldType } from "./decoderUtils";

interface ICallParamFiledProps {
  value: CallParameterFieldType;
  idx: number;
  functionAbi: AbiFunction | null;
}

export const CallParamField: React.FC<ICallParamFiledProps> = ({ value, idx, functionAbi }) => {
  if (functionAbi?.type !== "function") return;

  const resolvedValue = resolveValue(value, functionAbi.inputs?.[idx]);
  const label = resolveAddon(functionAbi.inputs?.[idx].name ?? "", functionAbi.inputs?.[idx].type, idx);

  return <InputText label={decodeCamelCase(label)} className="w-full" value={resolvedValue} disabled={true} />;
};
