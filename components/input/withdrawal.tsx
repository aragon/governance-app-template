import { Action } from "@/utils/types";
import { FC, useEffect, useState } from "react";
import { InputText } from '@aragon/ods'
import { Address } from "viem";

interface WithdrawalInputProps {
    setAction: Function;
}

const WithdrawalInput: FC<WithdrawalInputProps> = ({ setAction }) => {
    const [to, setTo] = useState<Address>();
    const [value, setValue] = useState<number>()

    useEffect(() => {
        setAction([{ to, value, data: '0x' } as unknown as Action])
    }, [to, value])

    const handleTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTo(event?.target?.value as Address);
    }

    const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event?.target?.value));
    }
    return (
        <div className="my-6">
            <div className="mb-3 pb-3">
                <InputText
                    className=""
                    label="Address"
                    placeholder="Destination address" 
                    variant="default"
                    value={to}
                    onChange={handleTo}
                    />
            </div>
            <div className="mb-6">
                <InputText
                    className=""
                    label="Amount (in weis)"
                    placeholder="1000000000000000000" 
                    variant="default"
                    value={value}
                    onChange={handleValue}
                    />
            </div>
        </div>
    )
};

export default WithdrawalInput
