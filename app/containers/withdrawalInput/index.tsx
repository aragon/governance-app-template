import { FC } from "react";

interface WithdrawalInputProps {
    toVariable: string;
    toFunction: any;
    valueVariable: string;
    valueFunction: any;
}

const WithdrawalInput: FC<WithdrawalInputProps> = ({ toVariable, toFunction, valueVariable, valueFunction }) => (
    <div className="my-6">
        <div className="mb-3 pb-3">
            <label className="block mb-2 text-md font-medium text-neutral-700">Address:</label>
            <input
                type="text"
                id="base-input"
                className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={toVariable}
                onChange={toFunction}
            />
        </div>
        <div className="mb-6">
            <label className="block mb-2 text-md text-neutral-700">Amount (in weis):</label>
            <input
                type="number"
                id="base-input"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={valueVariable}
                onChange={valueFunction}
            />
        </div>
    </div>
);

export default WithdrawalInput
