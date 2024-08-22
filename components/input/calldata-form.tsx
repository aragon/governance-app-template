import { type RawAction } from "@/utils/types";
import { type FC, useEffect, useState } from "react";
import { InputText, InputNumber, TextArea, AlertInline } from "@aragon/ods";
import { type Address, parseEther, isHex, decodeFunctionData, Hex, toFunctionSelector, AbiFunction } from "viem";
import { isAddress } from "@/utils/evm";
import { If } from "../if";
import { PUB_CHAIN } from "@/constants";
import { useIsContract } from "@/hooks/useIsContract";
import { PleaseWaitSpinner } from "../please-wait";
import { useAbi } from "@/hooks/useAbi";
import { CallFunctionSignatureField, CallParamField } from "../proposalActions/callParamField";

interface ICalldataFormProps {
  onChange: (action: RawAction) => any;
  onSubmit?: () => any;
}

export const CalldataForm: FC<ICalldataFormProps> = ({ onChange, onSubmit }) => {
  const coinName = PUB_CHAIN.nativeCurrency.symbol;
  const [to, setTo] = useState<Address>();
  const [calldata, setCalldata] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const { isContract, isLoading, error: isContractError } = useIsContract(to);
  const { abi, isLoading: isLoadingAbi } = useAbi((to || "") as Address);

  useEffect(() => {
    if (!isAddress(to)) return;
    else if (!isHex(calldata) || calldata.trim().length % 2 !== 0) return;

    onChange({ to, value: BigInt(value || "0"), data: calldata } as unknown as RawAction);
  }, [to, calldata, value]);

  const handleTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event?.target?.value as Address);
  };

  let decodedParams: ReturnType<typeof decodeFunctionData> | null = null;
  let matchingAbiFunction: AbiFunction | null = null;
  try {
    decodedParams = decodeFunctionData({
      abi: abi,
      data: calldata as Hex,
    });

    for (const item of abi) {
      const selector = toFunctionSelector(item);
      if (calldata.startsWith(selector)) {
        matchingAbiFunction = item;
      }
    }
  } catch (_) {
    //
  }

  return (
    <div className="my-6">
      <div className="mb-3 pb-3">
        <InputText
          label="Contract address"
          placeholder="0x1234..."
          variant={!to || isAddress(to) ? "default" : "critical"}
          value={to}
          alert={
            !!to && !isAddress(to)
              ? { message: "The address of the contract is not valid", variant: "critical" }
              : isLoading
                ? undefined
                : isContractError
                  ? { message: "Cannot check the given address", variant: "critical" }
                  : !!to && !isContract
                    ? { message: "The given address is not a contract", variant: "warning" }
                    : undefined
          }
          onChange={handleTo}
        />
        <If true={isLoading}>
          <div className="py-2">
            <PleaseWaitSpinner />
          </div>
        </If>
      </div>
      <If all={[to, !isLoading]}>
        <div className="pb-4">
          <TextArea
            className=""
            label="Calldata"
            placeholder="0x..."
            value={calldata}
            alert={resolveCalldataAlert(calldata, abi, decodedParams)}
            onChange={(e) => setCalldata(e.target.value)}
          />
        </div>
        <div>
          <InputNumber
            label={`${coinName} amount (optional)`}
            placeholder="1.234"
            min={0}
            onChange={(val: string) => setValue(parseEther(val).toString())}
            onKeyDown={(e) => (e.key === "Enter" ? onSubmit?.() : null)}
          />
        </div>
        {/* Try to decode */}
        <If true={!!calldata}>
          <If true={!!decodedParams}>
            <div className="flex flex-row items-center justify-between border-b border-neutral-200 py-4">
              <p className="text-md font-semibold text-neutral-800">Decoded parameters</p>
            </div>

            <div className="mt-4 flex flex-col gap-y-4">
              <CallFunctionSignatureField functionAbi={matchingAbiFunction} />
              {decodedParams?.args?.map((arg, i) => (
                <div className="flex" key={i}>
                  <CallParamField value={arg as any} idx={i} functionAbi={matchingAbiFunction} />
                </div>
              ))}
            </div>
          </If>
        </If>
      </If>
    </div>
  );
};

function resolveCalldataAlert(
  calldata: string,
  abi: AbiFunction[] | null,
  decodedParams: {
    args: readonly unknown[];
    functionName: string;
  } | null
): { message: string; variant: "critical" | "warning" } | undefined {
  if (!calldata) return undefined;
  else if (!isHex(calldata) || calldata.trim().length % 2 !== 0) {
    return { message: "The given calldata is not a valid hex string", variant: "critical" };
  } else if (!abi?.length) return undefined;
  else if (!decodedParams) {
    return { message: "The given calldata cannot be decoded using the available ABI", variant: "warning" };
  }
  return undefined;
}
