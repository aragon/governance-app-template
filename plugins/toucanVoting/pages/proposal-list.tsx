import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { type ReactNode, useEffect } from "react";
import ProposalCard from "@/plugins/toucanVoting/components/proposal";
import { TokenVotingAbi } from "@/plugins/toucanVoting/artifacts/TokenVoting.sol";
import {
  Button,
  DataList,
  IconType,
  IllustrationHuman,
  ProposalDataListItemSkeleton,
  type DataListState,
} from "@aragon/ods";
import { useCanCreateProposal } from "@/plugins/toucanVoting/hooks/useCanCreateProposal";
import Link from "next/link";
import { Else, If, Then } from "@/components/if";
import { PUB_TOUCAN_VOTING_PLUGIN_ADDRESS, PUB_CHAIN } from "@/constants";

import Bridge from "../components/bridge/BridgeToL2";

const DEFAULT_PAGE_SIZE = 6;

export default function Proposals() {
  const { isConnected } = useAccount();
  const canCreate = useCanCreateProposal();

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    data: proposalCountResponse,
    error: isError,
    isLoading,
    isFetching: isFetchingNextPage,
    refetch,
  } = useReadContract({
    address: PUB_TOUCAN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
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

  const emptyFilteredState = {
    heading: "No proposals found",
    description: "Your applied filters are not matching with any results. Reset and search with other filters!",
    secondaryButton: {
      label: "Reset all filters",
      iconLeft: IconType.RELOAD,
    },
  };

  const errorState = {
    heading: "Error loading proposals",
    description: "There was an error loading the proposals. Try again!",
    secondaryButton: {
      label: "Reload proposals",
      iconLeft: IconType.RELOAD,
      onClick: () => refetch(),
    },
  };

  return (
    <MainSection>
      <SectionView>
        <div className="flex w-full max-w-screen-xl justify-between gap-x-10">
          <h1 className="justify-self-start align-middle text-3xl font-semibold">Proposals</h1>
          <div className="justify-self-end">
            <If condition={isConnected && canCreate}>
              <Link href="#/new">
                <Button iconLeft={IconType.PLUS} size="md" variant="primary">
                  Submit Proposal
                </Button>
              </Link>
            </If>
          </div>
        </div>

        <div
          className="mx-auto flex w-full max-w-screen-xl flex-col justify-between 
        gap-5 md:flex-row md:pb-20 "
        >
          <div className="flex w-full flex-col gap-x-12 gap-y-6 md:w-auto md:flex-row">
            <If condition={proposalCount}>
              <Then>
                <DataList.Root
                  entityLabel={entityLabel}
                  itemsCount={proposalCount}
                  pageSize={DEFAULT_PAGE_SIZE}
                  state={dataListState}
                  //onLoadMore={fetchNextPage}
                >
                  <DataList.Container
                    SkeletonElement={ProposalDataListItemSkeleton}
                    errorState={errorState}
                    emptyFilteredState={emptyFilteredState}
                  >
                    {proposalCount &&
                      Array.from(Array(proposalCount)?.keys())
                        .reverse()
                        ?.map((proposalIndex, index) => (
                          // TODO: update with router agnostic ODS DataListItem
                          <ProposalCard key={proposalIndex} proposalId={BigInt(proposalIndex)} />
                        ))}
                  </DataList.Container>
                  <DataList.Pagination />
                </DataList.Root>
              </Then>
              <Else>
                <div className="w-full">
                  <p className="text-md text-neutral-400">
                    No proposals have been created yet. Here you will see the proposals created by the Security Council
                    before they can be submitted to the{" "}
                    <Link href="/plugins/community-proposals/#/" className="underline">
                      community voting stage
                    </Link>
                    .
                  </p>
                  <IllustrationHuman
                    className="mx-auto mb-10 max-w-72"
                    body="BLOCKS"
                    expression="SMILE_WINK"
                    hairs="CURLY"
                  />
                  <If condition={isConnected && canCreate}>
                    <div className="flex justify-center">
                      <Link href="#/new">
                        <Button iconLeft={IconType.PLUS} size="md" variant="primary">
                          Submit Proposal
                        </Button>
                      </Link>
                    </div>
                  </If>
                </div>
              </Else>
            </If>
          </div>
          <div>
            <Bridge />
          </div>
        </div>
      </SectionView>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return <main className="w-full p-4 md:px-6 md:pb-20 xl:pt-10">{children}</main>;
}

function SectionView({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center gap-y-6 md:px-6">{children}</div>;
}
