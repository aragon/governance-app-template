import Image from "next/image";
import { mainnet } from 'wagmi/chains'
import { usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { useAccount } from 'wagmi'
import { Address, PublicClient, parseAbi, formatUnits } from "viem";
import { ReactNode, useEffect, useState } from "react";
import { If, IfNot } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useDelegateAnnouncements } from "../hooks/useDelegateAnnouncements";
import { Button, Card, Link } from "@aragon/ods";
import { useEnsName, useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { formatHexString } from "@/utils/evm";

const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "") as Address

export default function DelegateAnnouncements() {
    const publicClient = usePublicClient();
    const account = useAccount()
    const { delegateAnnouncements, isLoading: delegateAnnouncementsIsLoading } = useDelegateAnnouncements(publicClient as PublicClient)

    const skipRender = useSkipFirstRender();
    if (skipRender) return <></>;

    return (
        <MainSection>
            <If condition={account?.address}>
                <SectionView>
                    <If condition={delegateAnnouncements.length}>
                      <div>
                      <h2 className="text-xl font-semibold text-neutral-700 pb-3">Your profile</h2>
                      <SelfDelegationProfileCard 
                        address={account.address!}
                        tokenAddress={TOKEN_ADDRESS} 
                        message={delegateAnnouncements.findLast((an) => an.delegate === account.address)?.message }/>
                      </div>
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
                        <DelegateCard key={announcement.logIndex} delegate={announcement.delegate} message={announcement.message} tokenAddress={TOKEN_ADDRESS} />
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
        <div className="flex flex-row justify-between content-center w-full mb-6">
            {children}
        </div>
    );
}

type DelegateCardProps = {
    delegate: Address;
    tokenAddress: Address;
    message: string;
}

const iVotesAbi = parseAbi([
    'function getVotes(address owner) view returns (uint256)',
    'function delegate(address delegatee) external'
])

type SelfDelegationProfileCardProps = {
  address: Address;
  tokenAddress: Address;
  message: string | undefined;
}

const SelfDelegationProfileCard = ({ address, tokenAddress, message }: SelfDelegationProfileCardProps) => {
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

    const delegateTo = () => {
        delegateWrite({
            abi: iVotesAbi,
            address: tokenAddress,
            functionName: 'delegate',
            args: [address],
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
            <p className="text-md text-neutral-500 m-1 grow">
                {message}
            </p>
                <div className="mt-1">
                    <Button variant="tertiary" size="sm" onClick={() => delegateTo()}>Delegate</Button>
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
            <If condition={account.address}>
                <div className="mt-1">
                    <Button variant="tertiary" size="sm" onClick={() => delegateTo()}>Delegate</Button>
                </div>
            </If>
        </Card>
    )
}
