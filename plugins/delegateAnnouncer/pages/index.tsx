import { usePublicClient, useReadContract } from "wagmi";
import { useAccount } from 'wagmi'
import { Address, PublicClient, parseAbi } from "viem";
import { ReactNode } from "react";
import { If, IfNot } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useDelegateAnnouncements } from "../hooks/useDelegateAnnouncements";
import { DelegateCard } from "@/plugins/delegateAnnouncer/components/DelegateCard";
import { SelfDelegationProfileCard } from "../components/UserDelegateCard";

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

            <h2 className="text-3xl font-semibold text-neutral-700 pt-1">Delegates</h2>
            <IfNot condition={delegateAnnouncements.length}>
                <If condition={delegateAnnouncementsIsLoading}>
                    <SectionView>
                        <span className="my-3">
                            <PleaseWaitSpinner />
                        </span>
                    </SectionView>
                </If>
                <If condition={!delegateAnnouncementsIsLoading}>
                    <span className="my-3">No delegations have been registered on this DAO</span>
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



const iVotesAbi = parseAbi([
    'function getVotes(address owner) view returns (uint256)',
    'function delegate(address delegatee) external',
    'function delegates(address account) public view returns (address)'
])

