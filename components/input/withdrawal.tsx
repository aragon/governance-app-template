import { type Action } from "@/utils/types";
import { type FC, useEffect, useState } from "react";
import { InputText, InputNumber, AlertInline } from "@aragon/ods";
import { type Address, parseEther } from "viem";
import { isAddress } from "@/utils/evm";
import { ElseIf, If, Then } from "../if";

interface WithdrawalInputProps {
  setActions: (actions: Action[]) => any;
}

const WithdrawalInput: FC<WithdrawalInputProps> = ({ setActions }) => {
  const [to, setTo] = useState<Address>();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (!isAddress(to)) return;
    else if (!isNumeric(value)) return;

    setActions([{ to, value: BigInt(value), data: "" } as unknown as Action]);
  }, [setActions, to, value]);

  const handleTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event?.target?.value as Address);
  };

  return (
    <div className="my-6">
      <div className="mb-3 pb-3">
        <InputText
          label="Address"
          placeholder="0x1234..."
          variant={!to || isAddress(to) ? "default" : "critical"}
          value={to}
          onChange={handleTo}
        />
        <If not={to}>
          <Then>
            <p className="mt-3">Enter the address to transfer to</p>
          </Then>
          <ElseIf not={isAddress(to)}>
            <AlertInline className="mt-3" message="The address of the contract is not valid" variant="critical" />
          </ElseIf>
        </If>
      </div>
      <div className="mb-6">
        <InputNumber
          label="Amount"
          placeholder="1.234 ETH"
          min={0}
          variant={typeof value === "undefined" || isNumeric(value) ? "default" : "critical"}
          onChange={(val: string) => setValue(parseEther(val).toString())}
        />
      </div>
    </div>
  );
};

function isNumeric(value: string): boolean {
  if (!value) return true;
  return !!value.match(/^[0-9]+$/);
}

export default WithdrawalInput;
