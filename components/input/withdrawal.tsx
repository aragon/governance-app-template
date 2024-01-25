import { Action } from "@/utils/types";
import { FC, useEffect, useState } from "react";
import { InputText } from '@aragon/ods'
import { Address } from "viem";
import { isAddress } from "@/utils/evm";

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
        const n = Number(event?.target?.value)
        setValue(n);
    }
    return (
        <div className="my-6">
            <div className="mb-3 pb-3">
                <InputText
                    className=""
                    label="Address"
                    placeholder="0x..." 
                    variant={(!to || isAddress(to)) ? "default" : "critical"}
                    value={to}
                    onChange={handleTo}
                    />
            </div>
            <div className="mb-6">
                <InputText
                    className=""
                    label="Amount (in weis)"
                    placeholder="1000000000000000000" 
                    variant={(typeof value === "undefined" || !isNaN(value)) ? "default" : "critical"}
                    value={value}
                    onChange={handleValue}
                    />
            </div>
        </div>
    )
};

export default WithdrawalInput
