import { Action } from "@/utils/types";
import { FC, useEffect, useState } from "react";
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
                <label className="block mb-2 text-md font-medium text-neutral-700">Address:</label>
                <input
                    type="text"
                    id="base-input"
                    className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={to}
                    onChange={handleTo}
                />
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-md text-neutral-700">Amount (in weis):</label>
                <input
                    type="number"
                    id="base-input"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={value}
                    onChange={handleValue}
                />
            </div>
        </div>
    )
};

export default WithdrawalInput
