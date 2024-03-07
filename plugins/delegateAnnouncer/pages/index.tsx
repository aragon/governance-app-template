import { usePublicClient, useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { PublicClient, parseAbi } from "viem";
import { ReactNode } from "react";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useDelegateAnnouncements } from "../hooks/useDelegateAnnouncements";
import { DelegateCard } from "@/plugins/delegateAnnouncer/components/DelegateCard";
import { SelfDelegationProfileCard } from "../components/UserDelegateCard";
import {
  PUB_DAO_ADDRESS,
  PUB_DELEGATION_CONTRACT_ADDRESS,
  PUB_TOKEN_ADDRESS,
} from "@/constants";

export default function DelegateAnnouncements() {
  const publicClient = usePublicClient();
  const account = useAccount();
  const { data: delegates, status } = useReadContract({
    abi: iVotesAbi,
    address: PUB_TOKEN_ADDRESS,
    functionName: "delegates",
    args: [account.address!],
  });
  const { delegateAnnouncements, isLoading: delegateAnnouncementsIsLoading } =
    useDelegateAnnouncements(
      publicClient as PublicClient,
      PUB_DELEGATION_CONTRACT_ADDRESS,
      PUB_DAO_ADDRESS
    );

  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  return (
    <MainSection>
      <If condition={account?.address}>
        <SectionView>
          <h2 className="text-xl font-semibold text-neutral-700 pb-3">
            Your profile
          </h2>
          <SelfDelegationProfileCard
            address={account.address!}
            tokenAddress={PUB_TOKEN_ADDRESS}
            delegates={delegates!}
            loading={status === "pending"}
            message={
              delegateAnnouncements.findLast(
                (an) => an.delegate === account.address
              )?.message
            }
          />
        </SectionView>
      </If>

      <h2 className="text-3xl font-semibold text-neutral-700">Delegates</h2>
      <If condition={delegateAnnouncements.length}>
        <Then>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 mb-14 gap-4">
            {delegateAnnouncements.map((announcement) => (
              <DelegateCard
                key={announcement.logIndex}
                delegates={delegates!}
                delegate={announcement.delegate}
                message={announcement.message}
                tokenAddress={PUB_TOKEN_ADDRESS}
              />
            ))}
          </div>
        </Then>
        <ElseIf condition={delegateAnnouncementsIsLoading}>
          <SectionView>
            <span className="my-3">
              <PleaseWaitSpinner />
            </span>
          </SectionView>
        </ElseIf>
        <Else>
          <span className="my-3">
            There are no delegate announcements on the DAO
          </span>
        </Else>
      </If>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return <main className="flex flex-col w-screen max-w-full">{children}</main>;
}

function SectionView({ children }: { children: ReactNode }) {
  return <div className="flex flex-col w-full mb-6">{children}</div>;
}

const iVotesAbi = parseAbi([
  "function getVotes(address owner) view returns (uint256)",
  "function delegate(address delegatee) external",
  "function delegates(address account) public view returns (address)",
]);
