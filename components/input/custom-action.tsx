import { FC, useEffect, useState, useCallback } from "react";
import { Address, encodeFunctionData, parseEther } from "viem";
import { whatsabi } from "@shazow/whatsabi";
import { usePublicClient } from "wagmi";
import { InputText } from '@aragon/ods'
import { AbiFunction } from "abitype";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { isAddress } from "@/utils/evm";
import { Action } from "@/utils/types";
import { If, IfNot } from "@/components/if";

interface CustomActionInputProps {
    setActions: (actions: Action[]) => any;
}

const etherscanKey: string = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

const CustomActionInput: FC<CustomActionInputProps> = ({ setActions }) => {
    const publicClient = usePublicClient()
    const [abi, setAbi] = useState<AbiFunction[]>();
    const [selectedAbiItem, setSelectedAbiItem] = useState<AbiFunction>();
    const [loadingAbi, setLoadingAbi] = useState<boolean>(false);
    const [abiInputValues, setAbiInputValues] = useState<string[]>([]);
    const [value, setValue] = useState<number>(0)
    const [to, setTo] = useState<Address>()
    const [data, setCallData] = useState<Address>(`0x`)

    const handleInputChange = (setter: Function) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setter(event?.target?.value);
    }

    const getContractAbi = useCallback(async () => {
        if (!publicClient) return
        else if (!isAddress(to)) return

        setLoadingAbi(true)
        const abiLoader = new whatsabi.loaders.EtherscanABILoader({ apiKey: etherscanKey });
        const { abi } = await whatsabi.autoload(to!, {
            provider: publicClient,
            abiLoader,
            followProxies: true,
            enableExperimentalMetadata: true
        });
        setAbi(abi.filter(item => item.type === "function" && item.stateMutability !== "pure" && item.stateMutability !== "view") as any)
        setLoadingAbi(false)
    }, [to, publicClient?.account])

    useEffect(() => {
        if (!isAddress(to)) return
        getContractAbi()
    }, [to])

    useEffect(() => {
        if (!to || !isAddress(to)) return;
        setActions([{ to, value: parseEther(value.toString()), data }])
    }, [to, value, data])

    useEffect(() => {
        if (!abi || !selectedAbiItem) return;

        let invalid = false;
        if (!abi?.length) invalid = true;
        else if (!selectedAbiItem?.name) invalid = true;
        else if (selectedAbiItem.inputs.length !== abiInputValues.length) invalid = true;
        else if (abiInputValues.some(value => !value)) invalid = true;

        if (invalid) {
            setCallData("0x")
            return
        }

        setCallData(encodeFunctionData({ abi, functionName: selectedAbiItem.name, args: abiInputValues }))
    }, [abi, abiInputValues])

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
                    variant={(!to || isAddress(to)) ? "default" : "critical"}
                    value={to}
                    onChange={handleInputChange(setTo)}
                    />
            </div>
            <If condition={loadingAbi}>
                <div>
                    <PleaseWaitSpinner/>
                </div>
            </If>
            <If condition={!loadingAbi}>
                <If condition={!(abi?.length) && !isAddress(to)}>
                    <p>The address of the contract is not valid</p>
                </If><If condition={!(abi?.length) && isAddress(to)}>
                    <p>The ABI of the contract is not publicly available</p>
                </If>
                <If condition={abi?.length && isAddress(to)}>
                    <div className="flex h-96 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="w-2/5 bg-neutral-50 m-1 px-2 py-4 overflow-y-auto overflow-x-auto border-r border-neutral-200">
                            <ul className="space-y-2">
                                {abi?.map((abiItemSelection, index) => (
                                    <li
                                        key={index}
                                        onClick={() => setSelectedAbiItem(abiItemSelection as AbiFunction) }
                                        className={`w-full text-left font-sm hover:bg-neutral-100 py-3 px-4 rounded-xl hover:cursor-pointer ${abiItemSelection.name === selectedAbiItem?.name && 'bg-neutral-100 font-semibold'}`}>
                                        {abiItemSelection.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-2/3 bg-primary-50 py-4 overflow-y-auto">
                            <IfNot condition={selectedAbiItem}>
                                <p className="ml-4 mt-2">Select a contract function from the list</p>
                            </IfNot>
                            <If condition={selectedAbiItem}>
                                <div className="">
                                    <p className="text-xl font-semibold text-neutral-800 pt-1 pb-3 px-6 border-b border-neutral-200"><code>{selectedAbiItem?.name}</code></p>
                                    {selectedAbiItem?.inputs.map((argument, i) => (
                                        <div key={i} className="my-4 mx-6">
                                            <InputText
                                                className=""
                                                label={argument.name || "Parameter " + (i+1)}
                                                placeholder={argument.name || argument.type} 
                                                variant="default"
                                                value={abiInputValues[i] || ''}
                                                onChange={handleAbiInputChange(i)}
                                                />
                                        </div>
                                    ))}
                                    <If condition={selectedAbiItem?.payable}>
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
                                    </If>
                                </div>
                            </If>
                        </div>
                    </div>
                </If>
            </If>
        </div>
    )
};

export default CustomActionInput
