import { create } from 'ipfs-http-client';
import { Button, IconType, Icon } from '@aragon/ods'
import React, { useEffect, useState } from 'react'
import { uploadToIPFS } from '@/utils/ipfs'
import { useContractWrite } from 'wagmi';
import { Address, toHex } from 'viem'
import { TokenVotingAbi } from '@/artifacts/TokenVoting.sol';
import { useAlertContext } from '../../context/AlertContext';
import WithdrawalInput from '@/components/input/withdrawal'
import CustomActionInput from '@/components/input/custom-action'
import { Action } from '@/utils/types'

const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const ipfsKey = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";
const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

const auth = ipfsKey; // Replace YOUR_API_KEY with your actual API key

enum ActionType {
    Signaling,
    Withdrawal,
    Custom
}

export default function Create() {
    const [ipfsPin, setIpfsPin] = useState<string>('');
    const [title, setTitle] = useState<string>();
    const [summary, setSummary] = useState<string>();
    const [action, setAction] = useState<Action[]>([]);
    const { addAlert } = useAlertContext()
    const { write: createProposalWrite } = useContractWrite({
        abi: TokenVotingAbi,
        address: pluginAddress,
        functionName: 'createProposal',
        args: [toHex(ipfsPin), [action], 0, 0, 0, 0, 0],
        onSuccess(data) {
            addAlert("We got your proposal!", data.hash)
        },
    });
    const [actionType, setActionType] = useState<ActionType>(ActionType.Signaling)

    const client = create({
        url: ipfsEndpoint,
        headers: { 'X-API-KEY': auth, 'Accept': 'application/json' }
    });

    useEffect(() => {
        // console.log("Contract proposal thingy: ", action)
        if (ipfsPin !== '') createProposalWrite?.()
    }, [ipfsPin])

    const submitIPFS = async () => {
        const proposalMetadataJsonObject = { title, summary };
        const blob = new Blob([JSON.stringify(proposalMetadataJsonObject)], { type: 'application/json' });

        const ipfsPin = await uploadToIPFS(client, blob);
        setIpfsPin(ipfsPin!)
    }

    const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event?.target?.value);
    };
    const handleSummaryInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSummary(event?.target?.value);
    };


    return (
        <main className="flex pt-12 w-screen max-w-full">
            <div className="w-3/4 mx-auto">
                <h1 className="font-semibold text-neutral-900 text-3xl mb-10">Create Proposal</h1>
                <div className="mb-6 pb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Title</label>
                    <input
                        type="text"
                        id="base-input"
                        className="bg-gray-50 border border-neutral-100 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={title}
                        onChange={handleTitleInput}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg text-gray-900 ">Summary</label>
                    <textarea
                        id="message"
                        rows={6}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-neutral-100 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Leave the description..."
                        value={summary}
                        onChange={handleSummaryInput}
                    ></textarea>
                </div>
                <div className="mb-6">
                    <span className="block mb-2 text-lg text-gray-900 ">Select proposal action</span>
                    <div className="grid grid-cols-3 gap-3 h-32">
                        <div
                            onClick={() => setActionType(ActionType.Signaling)}
                            className={`cursor-pointer rounded-xl bg-neutral-0 border border-neutral-100 hover:border-primary-400 active:border-primary-700 flex flex-col items-center ${actionType === ActionType.Signaling ? 'border-primary-400 border-2' : 'border-neutral-100'}`}>

                            <Icon
                                className="p-2 rounded-full text-primary-400 !h-12 !w-12 mt-5 mb-2"
                                icon={IconType.INFO}
                                size="lg"
                            />
                            <span className="text-md text-neutral-400">Signaling proposal</span>
                        </div>
                        <div
                            onClick={() => setActionType(ActionType.Withdrawal)}
                            className={`cursor-pointer rounded-xl bg-neutral-0 border border-neutral-100 hover:border-primary-400 active:border-primary-700 flex flex-col items-center ${actionType === ActionType.Withdrawal ? 'border-primary-400 border-2' : 'border-neutral-100'}`}>
                            <Icon
                                className="p-2 rounded-full text-primary-400 !h-12 !w-12 mt-5 mb-2"
                                icon={IconType.TX_WITHDRAW}
                                size="lg"
                            />
                            <span className="text-md text-neutral-400">DAO Payment</span>
                        </div>
                        <div
                            onClick={() => setActionType(ActionType.Custom)}
                            className={`cursor-pointer rounded-xl bg-neutral-0 border border-neutral-100 hover:border-primary-400 active:border-primary-700 flex flex-col items-center ${actionType === ActionType.Custom ? 'border-primary-400 border-2' : 'border-neutral-100'}`}>
                            <Icon
                                className="p-2 rounded-full text-primary-400 !h-12 !w-12 mt-5 mb-2"
                                icon={IconType.BLOCKCHAIN}
                                size="lg"
                            />
                            <span className="text-md text-neutral-400">Custom action</span>
                        </div>
                    </div>
                    <div className="mb-6">
                        {actionType === ActionType.Withdrawal && (<WithdrawalInput setAction={setAction} />)}
                        {actionType === ActionType.Custom && (<CustomActionInput setAction={setAction} />)}
                    </div>
                </div>

                <Button
                    className='mt-14'
                    size="lg"
                    variant='primary'
                    onClick={() => submitIPFS()}
                >
                    Submit
                </Button>
            </div>
        </main>
    )
}

