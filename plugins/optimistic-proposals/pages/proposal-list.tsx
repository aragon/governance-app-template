import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { useEffect } from "react";
import ProposalCard from "../components/proposal";
import { AlertCard, DataList, Link, ProposalDataListItemSkeleton, type DataListState } from "@aragon/ods";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_CHAIN } from "@/constants";
import { MyOptimisticTokenVotingPluginAbi } from "../artifacts/MyOptimisticTokenVotingPlugin.sol";
import { MainSection } from "@/components/layout/main-section";
import { MissingContentView } from "@/components/MissingContentView";
import { ADDRESS_ZERO } from "@/utils/evm";
import { useTokenVotes } from "@/hooks/useTokenVotes";
import { AddressText } from "@/components/text/address";
import { Address } from "viem";

const DEFAULT_PAGE_SIZE = 6;

export default function Proposals() {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { balance, delegatesTo } = useTokenVotes(address);

  const {
    data: proposalCountResponse,
    error: isError,
    isLoading,
    isFetching: isFetchingNextPage,
    refetch,
  } = useReadContract({
    address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
    abi: MyOptimisticTokenVotingPluginAbi,
    functionName: "proposalCount",
    chainId: PUB_CHAIN.id,
  });
  const proposalCount = Number(proposalCountResponse);

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const entityLabel = proposalCount === 1 ? "Proposal" : "Proposals";

  let dataListState: DataListState = "idle";
  if (isLoading && !proposalCount) {
    dataListState = "initialLoading";
  } else if (isError) {
    dataListState = "error";
  } else if (isFetchingNextPage) {
    dataListState = "fetchingNextPage";
  }

  const hasBalance = !!balance && balance > BigInt(0);
  const delegatingToSomeoneElse = !!delegatesTo && delegatesTo !== address && delegatesTo !== ADDRESS_ZERO;
  const delegatedToZero = !!delegatesTo && delegatesTo === ADDRESS_ZERO;

  return (
    <MainSection narrow>
      <div className="flex w-full flex-row content-center justify-between">
        <h1 className="line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
          Proposals
        </h1>
      </div>
      <If true={hasBalance && (delegatingToSomeoneElse || delegatedToZero)}>
        <NoVetoPowerWarning
          delegatingToSomeoneElse={delegatingToSomeoneElse}
          delegatesTo={delegatesTo}
          delegatedToZero={delegatedToZero}
          address={address}
        />
      </If>
      <If true={proposalCount}>
        <Then>
          <DataList.Root
            entityLabel={entityLabel}
            itemsCount={proposalCount}
            pageSize={DEFAULT_PAGE_SIZE}
            state={dataListState}
          >
            <DataList.Container SkeletonElement={ProposalDataListItemSkeleton}>
              {Array.from(Array(proposalCount || 0)?.keys())
                .reverse()
                ?.map((proposalIndex) => <ProposalCard key={proposalIndex} proposalIndex={proposalIndex} />)}
            </DataList.Container>
            <DataList.Pagination />
          </DataList.Root>
        </Then>
        <Else>
          <MissingContentView>
            No proposals have been created yet.
            <br />
            Here you will see the list of proposals initiated by the Security Council.
          </MissingContentView>
        </Else>
      </If>
    </MainSection>
  );
}

const NoVetoPowerWarning = ({
  delegatingToSomeoneElse,
  delegatesTo,
  delegatedToZero,
  address,
}: {
  delegatingToSomeoneElse: boolean;
  delegatesTo: Address | undefined;
  delegatedToZero: boolean;
  address: Address | undefined;
}) => {
  return (
    <AlertCard
      description={
        <span className="text-sm">
          <If true={delegatingToSomeoneElse}>
            <Then>
              You are currently delegating your voting power to <AddressText bold={false}>{delegatesTo}</AddressText>.
              If you wish to participate by yourself in future proposals,
            </Then>
            <ElseIf true={delegatedToZero}>
              You have not self delegated your voting power to participate in the DAO. If you wish to participate in
              future proposals,
            </ElseIf>
          </If>
          &nbsp;make sure that{" "}
          <Link href={"/plugins/members/#/delegates/" + address} className="!text-sm text-primary-400 hover:underline">
            your voting power is self delegated
          </Link>
          .
        </span>
      }
      message={
        delegatingToSomeoneElse ? "Your voting power is currently delegated" : "You cannot veto on new proposals"
      }
      variant="info"
    />
  );
};
