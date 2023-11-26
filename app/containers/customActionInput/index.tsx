import { FC, useEffect, useState, useCallback } from "react";
import { Abi, Address, encodeFunctionData } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { Spinner } from '@aragon/ods'
import { AbiFunction } from "abitype";


interface CustomActionInputProps {
    setAction: Function;
}

const etherscanKey: string = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

const CustomActionInput: FC<CustomActionInputProps> = ({ setAction }) => {
    const publicClient = usePublicClient()
    const [abi, setAbi] = useState<Abi>();
    const [abiItem, setAbiItem] = useState<AbiFunction>();
    const [loadingAbi, setLoadingAbi] = useState<boolean>(false);
    const [abiInputValues, setAbiInputValues] = useState<string[]>([]);
    const [value, setValue] = useState<number>(0)
    const [to, setTo] = useState<Address>()
    const [data, setData] = useState<Address>(`0x`)


    const getContractAbi = useCallback(async () => {
        const abiLoader = new whatsabi.loaders.EtherscanABILoader({ apiKey: etherscanKey });
        const { abi } = await whatsabi.autoload(to!, {
            provider: publicClient,
            abiLoader,
            followProxies: true,
        });
        setAbi(abi as any)
        console.log(abi)
        setLoadingAbi(false)
    }, [to])

    useEffect(() => {
        if (to) {
            setLoadingAbi(true)
            getContractAbi()
        }
    }, [to])

    useEffect(() => {
        setAction({ to, value, data })
    }, [to, value, data])

    useEffect(() => {
        if (abi && abi.length >= 0 && abiItem?.name) setData(encodeFunctionData({ abi, functionName: abiItem.name, args: abiInputValues }))
    }, [abiInputValues])

    const handleTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTo(event?.target?.value as Address);
    }
    const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event?.target?.value));
    }

    const handleAbiInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValues = [...abiInputValues];
        newInputValues[index] = event.target.value;
        setAbiInputValues(newInputValues);
    };

    return (
        <div className="my-6">
            <div className="mb-3 pb-3">
                <label className="block mb-2 text-md font-medium text-neutral-700">Contract address:</label>
                <input
                    type="text"
                    id="base-input"
                    className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={to}
                    onChange={handleTo}
                />
            </div>
            {loadingAbi && (
                <div className="mb-3 pb-3">
                    <Spinner
                        size="xl"
                        variant="primary"
                    />
                </div>
            )}
            {!loadingAbi && abi && abi.length >= 0 && (
                <div className="flex h-96 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="w-2/5 bg-gray-200 px-2 py-4 overflow-y-auto overflow-x-auto border-r border-neutral-200">
                        <ul className="space-y-2">
                            {abi?.map(abiItemSelection => (
                                <li
                                    onClick={() => { setAbiItem(abiItemSelection as AbiFunction) }}
                                    className={`w-full text-left font-sm hover:bg-neutral-100 py-3 px-4 rounded-2xl hover:cursor-pointer ${abiItemSelection.name === abiItem?.name && 'bg-neutral-100 font-semibold'}`}>
                                    {abiItemSelection.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 bg-white py-4 overflow-y-auto">
                        {abiItem && (
                            <div className="">
                                <p className="text-xl font-semibold text-neutral-800 pt-1 pb-3 px-6 border-b border-neutral-200">{abiItem.name}</p>
                                {abiItem.inputs.map((itemInputs, i) => (
                                    <div className="my-4 mx-6">
                                        <label className="block mb-2 text-md font-medium text-neutral-700">{itemInputs.type}:</label>
                                        <input
                                            value={abiInputValues[i] || ''}
                                            onChange={handleAbiInputChange(i)}
                                            type="text"
                                            id="base-input"
                                            className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                        />
                                    </div>
                                ))}
                                {abiItem.payable && (
                                    <div className="my-4 mx-6">
                                        <label className="block mb-2 text-md font-medium text-neutral-700">Value:</label>
                                        <input
                                            value={value}
                                            onChange={handleValue}
                                            type="number"
                                            id="base-input"
                                            className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                        />
                                    </div>

                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}


        </div>
    )
};

export default CustomActionInput
