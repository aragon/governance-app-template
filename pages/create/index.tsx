import { create } from 'ipfs-http-client';
import { Button, IconType, Icon, InputText } from '@aragon/ods'
import React, { useEffect, useState } from 'react'
import { uploadToIPFS } from '@/utils/ipfs'
import { useContractWrite } from 'wagmi';
import { Address, toHex } from 'viem'
import { TokenVotingAbi } from '@/tokenVoting/artifacts/TokenVoting.sol';
import { useAlertContext } from '@/context/AlertContext';
import WithdrawalInput from '@/components/input/withdrawal'
import CustomActionInput from '@/components/input/custom-action'
import { Action } from '@/utils/types'

const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const ipfsKey = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";
const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address

const auth = ipfsKey; // Replace YOUR_API_KEY with your actual API key

enum ActionType {
    Signaling,
    Withdrawal,
    Custom
}

export default function Create() {
    const [ipfsPin, setIpfsPin] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [action, setAction] = useState<Action[]>([]);
    const { addAlert } = useAlertContext()
    const { write: createProposalWrite } = useContractWrite({
        abi: TokenVotingAbi,
        address: pluginAddress,
        functionName: 'createProposal',
        args: [toHex(ipfsPin), action, 0, 0, 0, 0, 0],
        onSuccess(data) {
            addAlert("We got your proposal!", data.hash)
        },
    });
    const [actionType, setActionType] = useState<ActionType>(ActionType.Signaling)

    const changeActionType = (actionType: ActionType) => {
        setAction([])
        setActionType(actionType)
    }

    const client = create({
        url: ipfsEndpoint,
        headers: { 'X-API-KEY': auth, 'Accept': 'application/json' }
    });

    useEffect(() => {
        if (ipfsPin !== '') createProposalWrite?.()
    }, [ipfsPin])

    const submitProposal = async () => {
        if(!title.trim()) return alert("Please, enter a title");
        else if(!summary.trim()) return alert("Please, enter a summary");
        
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
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="justify-between py-5 w-full">
                <h1 className="font-semibold text-neutral-900 text-3xl mb-10">Create Proposal</h1>
                <div className="mb-6 pb-6">
                    <InputText
                        className=""
                        label="Title"
                        maxLength={100}
                        placeholder="A short title that descrives the main purpose"
                        variant="default"
                        value={title}
                        onChange={handleTitleInput}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-semibold text-neutral-600">Summary</label>
                    <textarea
                        id="message"
                        rows={6}
                        className="block p-2.5 w-full text-md placeholder-neutral-300 text-neutral-600 bg-white rounded-xl border border-neutral-100 focus:ring-primary-300 focus:border-primary-300"
                        placeholder="A detailed description for what the proposal is all about"
                        value={summary}
                        onChange={handleSummaryInput}
                    ></textarea>
                </div>
                <div className="mb-6">
                    <span className="block mb-2 text-lg text-neutral-900 ">Select proposal action</span>
                    <div className="grid grid-cols-3 gap-5 h-24 mt-2">
                        <div
                            onClick={() => {changeActionType(ActionType.Signaling)}}
                            className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${actionType === ActionType.Signaling ? 'border-primary-300' : 'border-neutral-100'}`}>
                            <Icon
                                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                                icon={IconType.INFO}
                                size="lg"
                            />
                            <span className="text-sm text-neutral-400 text-center">Signaling</span>
                        </div>
                        <div
                            onClick={() => changeActionType(ActionType.Withdrawal)}
                            className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${actionType === ActionType.Withdrawal ? 'border-primary-300' : 'border-neutral-100'}`}>
                            <Icon
                                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                                icon={IconType.TX_WITHDRAW}
                                size="lg"
                            />
                            <span className="text-sm text-neutral-400 text-center">DAO Payment</span>
                        </div>
                        <div
                            onClick={() => changeActionType(ActionType.Custom)}
                            className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${actionType === ActionType.Custom ? 'border-primary-300' : 'border-neutral-100'}`}>
                            <Icon
                                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                                icon={IconType.BLOCKCHAIN}
                                size="lg"
                            />
                            <span className="text-sm text-neutral-400 text-center">Custom action</span>
                        </div>
                    </div>
                    <div className="mb-6">
                        {actionType === ActionType.Withdrawal && (<WithdrawalInput setAction={setAction} />)}
                        {actionType === ActionType.Custom && (<CustomActionInput setAction={setAction} />)}
                    </div>
                </div>

                <Button
                    className='mt-14 mb-6'
                    size="lg"
                    variant='primary'
                    onClick={() => submitProposal()}
                >
                    Submit
                </Button>
            </div>
        </section>
    )
}

