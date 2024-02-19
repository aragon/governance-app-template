import { useState } from "react";
import { If } from "@/components/if";
import Image from "next/image";
import { Button, Card, Link, TextAreaRichText } from "@aragon/ods";
import { Address, formatUnits, toHex } from "viem";
import { useEnsName, useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { mainnet } from 'wagmi/chains'
import { useReadContract, useWriteContract } from "wagmi";
import { iVotesAbi } from "../artifacts/iVotes.sol";
import { formatHexString } from "@/utils/evm";
import { DelegateAnnouncerAbi } from "@/plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";
import * as DOMPurify from 'dompurify'

const DELEGATION_CONTRACT = (process.env.NEXT_PUBLIC_DELEGATION_CONTRACT_ADDRESS || "") as Address;
const DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS || "") as Address;

type SelfDelegationProfileCardProps = {
    address: Address;
    tokenAddress: Address;
    message: string | undefined;
    delegates: Address;
}

export const SelfDelegationProfileCard = ({ address, tokenAddress, message, delegates }: SelfDelegationProfileCardProps) => {
    const [inputDescription, setInputDescription] = useState<string>();
    const result = useEnsName({
        chainId: mainnet.id,
        address,
    })
    const avatarResult = useEnsAvatar({
        name: normalize(result.data!),
        chainId: mainnet.id,
        gatewayUrls: ['https://cloudflare-ipfs.com']
    })
    const { data: votingPower } = useReadContract({
        abi: iVotesAbi,
        address: tokenAddress,
        functionName: "getVotes",
        args: [address]
    })
    const { writeContract: delegateWrite } = useWriteContract()
    const { writeContract: delegateAnnouncementWrite } = useWriteContract()

    const delegateTo = () => {
        delegateWrite({
            abi: iVotesAbi,
            address: tokenAddress,
            functionName: 'delegate',
            args: [address],
        })
    }

    const announceDelegate = () => {
        delegateAnnouncementWrite({
            abi: DelegateAnnouncerAbi,
            address: DELEGATION_CONTRACT,
            functionName: 'announceDelegation',
            args: [DAO_ADDRESS, toHex(inputDescription!)]
        })
    }

    return (
        <Card className="flex flex-col p-3 space-between">
            <div className="flex flex-row">
                <Image
                    src={avatarResult.data ? avatarResult.data : '/profile.jpg'}
                    width="48"
                    height="48"
                    className="rounded-xl w-24 m-2"
                    alt="profile pic"
                />
                <div className="flex flex-col justify-center">
                    <Link className="!text-xl !font-xl">{result.data ? result.data : formatHexString(address)}</Link>
                    <p className="text-md text-neutral-300">{votingPower ? formatUnits(votingPower!, 18)! : 0} Voting Power</p>
                </div>
            </div>
            <div className="text-md text-neutral-500 m-1 grow">
                <If condition={message}>
                    <div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message ?? "")
                    }}/>
                </If>
                <If condition={!message}>
                    <TextAreaRichText
                        label="Summary"
                        className='pt-2'
                        value={inputDescription}
                        onChange={setInputDescription}
                        placeholder="A short description of who are you and what do you bring into the DAO."
                    />
                </If>
            </div>
            <div className="flex flex-row gap-2">
            <If condition={delegates !== address}>
                <div className="mt-1">
                    <Button variant="secondary" size="sm" onClick={() => delegateTo()}>Delegate</Button>
                </div>
            </If>
                <div className="mt-1">
                    <Button variant="primary" size="sm" state={inputDescription === '<p></p>' || !inputDescription ? 'disabled' : ''} onClick={() => announceDelegate()}>Announce yourself!</Button>
                </div>
            </div>
        </Card>
    )
}