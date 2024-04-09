import { type FC, useState } from "react";
import { type Address, type Hex } from "viem";
import { AlertInline, InputText } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { isAddress } from "@/utils/evm";
import { type Action } from "@/utils/types";
import { Else, ElseIf, If, Then } from "@/components/if";
import { useAbi } from "@/hooks/useAbi";
import { FunctionSelector } from "./function-selector";
import { AddressText } from "../text/address";

interface FunctionCallFormProps {
  onAddAction: (action: Action) => any;
}
export const FunctionCallForm: FC<FunctionCallFormProps> = ({ onAddAction }) => {
  const [targetContract, setTargetContract] = useState<string>("");
  const { abi, isLoading: loadingAbi, isProxy, implementation } = useAbi(targetContract as Address);

  const actionEntered = (data: Hex, value: bigint) => {
    onAddAction({
      to: targetContract,
      value,
      data,
    });
    setTargetContract("");
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <InputText
          label="Contract address"
          placeholder="0x1234..."
          variant={!targetContract || isAddress(targetContract) ? "default" : "critical"}
          value={targetContract}
          onChange={(e) => setTargetContract(e.target.value || "")}
        />
      </div>
      <If condition={loadingAbi}>
        <Then>
          <div>
            <PleaseWaitSpinner />
          </div>
        </Then>
        <ElseIf not={targetContract}>
          <p>Enter the address of the contract to call in a new action</p>
        </ElseIf>
        <ElseIf not={isAddress(targetContract)}>
          <AlertInline message="The address of the contract is not valid" variant="critical" />
        </ElseIf>
        <ElseIf not={abi?.length}>
          <AlertInline message="Cannot find any public interface for the given contract address" variant="critical" />
        </ElseIf>
        <Else>
          <If condition={isProxy}>
            <p className="mb-6 text-sm opacity-80">
              The given contract is a proxy of <AddressText>{implementation}</AddressText>
            </p>
          </If>
          <FunctionSelector abi={abi} actionEntered={actionEntered} />
        </Else>
      </If>
    </div>
  );
};
