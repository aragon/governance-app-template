import { FC, useState } from "react";
import { Address, Hex } from "viem";
import { InputText } from "@aragon/ods";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { isAddress } from "@/utils/evm";
import { Action } from "@/utils/types";
import { Else, ElseIf, If, Then } from "@/components/if";
import { useAbi } from "@/hooks/useAbi";
import { FunctionSelector } from "./function-selector";

interface FunctionCallFormProps {
  onAddAction: (action: Action) => any;
}
export const FunctionCallForm: FC<FunctionCallFormProps> = ({
  onAddAction,
}) => {
  const [targetContract, setTargetContract] = useState<string>("");
  const { abi, isLoading: loadingAbi } = useAbi(targetContract as Address);

  const actionEntered = (data: Hex, value: bigint) => {
    onAddAction({
      to: targetContract,
      value,
      data,
    });
  };

  return (
    <div className="my-6">
      <div className="mb-3 pb-3">
        <InputText
          className=""
          label="Contract address"
          placeholder="0x1234..."
          variant={
            !targetContract || isAddress(targetContract)
              ? "default"
              : "critical"
          }
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
          <p>Enter the address of the contract to interact with</p>
        </ElseIf>
        <ElseIf not={isAddress(targetContract)}>
          <p>The address of the contract is not valid</p>
        </ElseIf>
        <ElseIf not={abi?.length}>
          <p>The ABI of the contract is not publicly available</p>
        </ElseIf>
        <Else>
          <FunctionSelector abi={abi} actionEntered={actionEntered} />
        </Else>
      </If>
    </div>
  );
};
