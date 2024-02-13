import Image from "next/image";
import { mainnet } from 'wagmi/chains'
import { usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { useAccount } from 'wagmi'
import { Address, PublicClient, parseAbi, formatUnits, toHex } from "viem";
import { ReactNode, useEffect, useState } from "react";
import { If, IfNot } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useDelegateAnnouncements } from "../hooks/useDelegateAnnouncements";
import { Button, Card, Link, TextAreaRichText } from "@aragon/ods";
import { useEnsName, useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { DelegateAnnouncerAbi } from "@/plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";
import { formatHexString } from "@/utils/evm";

const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "") as Address
const DELEGATION_CONTRACT = (process.env.NEXT_PUBLIC_DELEGATION_CONTRACT || "") as Address;
const DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS || "") as Address;

export default function DelegateAnnouncements() {
    const publicClient = usePublicClient();
    const account = useAccount()
    const { data: delegates } = useReadContract({
        abi: iVotesAbi,
        address: TOKEN_ADDRESS,
        functionName: "delegates",
        args: [account.address!]
    })
    const { delegateAnnouncements, isLoading: delegateAnnouncementsIsLoading } = useDelegateAnnouncements(publicClient as PublicClient, DELEGATION_CONTRACT, DAO_ADDRESS)

    const skipRender = useSkipFirstRender();
    if (skipRender) return <></>;

    return (
        <MainSection>
            <If condition={account?.address}>
                <SectionView>
                    <If condition={delegateAnnouncements.length}>
                            <h2 className="text-xl font-semibold text-neutral-700 pb-3">Your profile</h2>
                            <SelfDelegationProfileCard
                                address={account.address!}
                                tokenAddress={TOKEN_ADDRESS}
                                delegates={delegates!}
                                message={delegateAnnouncements.findLast((an) => an.delegate === account.address)?.message} />
                    </If>
                </SectionView>
            </If>

            <h2 className="text-xl font-semibold text-neutral-700 pt-1">Delegates</h2>
            <IfNot condition={delegateAnnouncements.length}>
                <If condition={delegateAnnouncementsIsLoading}>
                    <SectionView>
                        <PleaseWaitSpinner />
                    </SectionView>
                </If>
                <If condition={!delegateAnnouncementsIsLoading}>
                    <span className="my-3">There haven't been any delegation casts for this DAO</span>
                </If>
            </IfNot>
            <If condition={delegateAnnouncements.length}>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 mb-14 gap-4">
                    {delegateAnnouncements.map((announcement) => (
                        <DelegateCard key={announcement.logIndex} delegates={delegates!} delegate={announcement.delegate} message={announcement.message} tokenAddress={TOKEN_ADDRESS} />
                    ))}
                </div>
            </If>
        </MainSection>
    );
}

function MainSection({ children }: { children: ReactNode }) {
    return (
        <main className="flex flex-col mt-6 w-screen max-w-full">
            {children}
        </main>
    );
}

function SectionView({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col w-full mb-6">
            {children}
        </div>
    );
}

type DelegateCardProps = {
    delegate: Address;
    tokenAddress: Address;
    message: string;
    delegates: Address;
}

const iVotesAbi = parseAbi([
    'function getVotes(address owner) view returns (uint256)',
    'function delegate(address delegatee) external',
    'function delegates(address account) public view returns (address)'
])

type SelfDelegationProfileCardProps = {
    address: Address;
    tokenAddress: Address;
    message: string | undefined;
    delegates: Address;
}

const SelfDelegationProfileCard = ({ address, tokenAddress, message, delegates }: SelfDelegationProfileCardProps) => {
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
        console.log(inputDescription)
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
                <If condition={message}><span>{message}</span></If>
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
            <If condition={inputDescription === ''}>
                <div className="mt-1">
                    <Button variant="primary" size="sm" onClick={() => announceDelegate()}>Announce yourself!</Button>
                </div>
            </If>
            </div>
        </Card>
    )
}

const DelegateCard = ({ delegate, message, tokenAddress }: DelegateCardProps) => {
    const account = useAccount()
    const result = useEnsName({
        chainId: mainnet.id,
        address: delegate,
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
        args: [delegate]
    })
    const { writeContract: delegateWrite } = useWriteContract()

    const delegateTo = () => {
        delegateWrite({
            abi: iVotesAbi,
            address: tokenAddress,
            functionName: 'delegate',
            args: [delegate],
        })
    }

    return (
        <Card className="flex flex-col p-3 space-between">
            <div className="flex flex-row">
                <Image
                    src={avatarResult.data ? avatarResult.data : '/profile.jpg'}
                    width="24"
                    height="24"
                    className="rounded-xl w-12 m-2"
                    alt="profile pic"
                />
                <div className="flex flex-col justify-center">
                    <Link className="">{result.data ? result.data : formatHexString(delegate)}</Link>
                    <p className="text-sm text-neutral-300">{votingPower ? formatUnits(votingPower!, 18)! : 0} Voting Power</p>
                </div>
            </div>
            <p className="text-md text-neutral-500 m-1 grow">
                {message}
            </p>
            <If condition={account.address && account.address !== delegate}>
                <div className="mt-1">
                    <Button variant="tertiary" size="sm" onClick={() => delegateTo()}>Delegate</Button>
                </div>
            </If>
        </Card>
    )
}
