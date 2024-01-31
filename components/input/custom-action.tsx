import { FC, useEffect, useState, useCallback } from "react";
import { Address, encodeFunctionData } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { InputText } from '@aragon/ods'
import { AbiFunction } from "abitype";
import { PleaseWaitSpinner } from "../please-wait";

interface CustomActionInputProps {
    setAction: Function;
}

const etherscanKey: string = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

const CustomActionInput: FC<CustomActionInputProps> = ({ setAction }) => {
    const publicClient = usePublicClient()
    const [abi, setAbi] = useState<AbiFunction[]>();
    const [abiItem, setAbiItem] = useState<AbiFunction>();
    const [loadingAbi, setLoadingAbi] = useState<boolean>(false);
    const [abiInputValues, setAbiInputValues] = useState<string[]>([]);
    const [value, setValue] = useState<number>(0)
    const [to, setTo] = useState<Address>()
    const [data, setData] = useState<Address>(`0x`)

    const handleInputChange = (setter: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event?.target?.value);
    }

    const getContractAbi = useCallback(async () => {
        setLoadingAbi(true)
        const abiLoader = new whatsabi.loaders.EtherscanABILoader({ apiKey: etherscanKey });
        const { abi } = await whatsabi.autoload(to!, {
            provider: publicClient,
            abiLoader,
            followProxies: true,
        });
        setAbi(abi.filter(item => item.type === "function") as any)
        setLoadingAbi(false)
    }, [to])

    useEffect(() => {
        if (to) getContractAbi()
    }, [to])

    useEffect(() => {
        setAction([{ to, value, data }])
    }, [to, value, data])

    useEffect(() => {
        if (abi && abi.length >= 0 && abiItem?.name && abiItem.inputs.length === abiInputValues.length) {
            setData(encodeFunctionData({ abi, functionName: abiItem.name, args: abiInputValues }))
        }
    }, [abiInputValues])

    const handleAbiInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValues = [...abiInputValues];
        newInputValues[index] = event.target.value;
        setAbiInputValues(newInputValues);
    };

    return (
        <div className="my-6">
            <div className="mb-3 pb-3">
                <InputText
                    className=""
                    label="Contract address"
                    placeholder="0x..." 
                    variant="default"
                    value={to}
                    onChange={handleInputChange(setTo)}
                    />
            </div>
            {loadingAbi && (
                <div className="mb-3 pb-3">
                    <PleaseWaitSpinner/>
                </div>
            )}
            {!loadingAbi && abi && abi.length >= 0 && (
                <div className="flex h-96 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="w-2/5 bg-neutral-50 m-1 px-2 py-4 overflow-y-auto overflow-x-auto border-r border-neutral-200">
                        <ul className="space-y-2">
                            {abi?.map((abiItemSelection, index) => (
                                <li
                                    key={index}
                                    onClick={() => { setAbiItem(abiItemSelection as AbiFunction) }}
                                    className={`w-full text-left font-sm hover:bg-neutral-100 py-3 px-4 rounded-xl hover:cursor-pointer ${abiItemSelection.name === abiItem?.name && 'bg-neutral-100 font-semibold'}`}>
                                    {abiItemSelection.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 bg-primary-50 py-4 overflow-y-auto">
                        {abiItem && (
                            <div className="">
                                <p className="text-xl font-semibold text-neutral-800 pt-1 pb-3 px-6 border-b border-neutral-200">{abiItem.name}</p>
                                {abiItem.inputs.map((itemInputs, i) => (
                                    <div key={i} className="my-4 mx-6">
                                        <InputText
                                            className=""
                                            label={itemInputs.type}
                                            placeholder="" 
                                            variant="default"
                                            value={abiInputValues[i] || ''}
                                            onChange={handleAbiInputChange(i)}
                                            />
                                    </div>
                                ))}
                                {abiItem.payable && (
                                    <div className="my-4 mx-6">
                                        <InputText
                                            className=""
                                            label="Value (in weis)"
                                            placeholder="100" 
                                            variant="default"
                                            value={value}
                                            onChange={handleInputChange(setValue)}
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
