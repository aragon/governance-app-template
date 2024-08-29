import { DataList, IconType } from "@aragon/ods";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { VotesDataListItemSkeleton } from "./votesDataListItemSkeleton";
import { VotesDataListItemStructure } from "./votesDataListItemStructure";
import { IVote } from "@/utils/types";

const DEFAULT_PAGE_SIZE = 6;

interface IVotesDataListProps {
  votes: IVote[];
}

export const VotesDataList: React.FC<IVotesDataListProps> = (props) => {
  const { votes } = props;
  const { address } = useAccount();

  const totalVotes = votes.length;
  const showPagination = (totalVotes ?? 0) > DEFAULT_PAGE_SIZE;
  const entityLabel = totalVotes === 1 ? "Vote" : "Votes";

  const emptyFilteredState = {
    heading: "No votes found",
    description: "Your applied filters are not matching with any results. Reset and search with other filters!",
    secondaryButton: {
      label: "Reset all filters",
      iconLeft: IconType.RELOAD,
    },
  };

  const emptyState = {
    heading: "No votes cast",
  };

  const errorState = {
    heading: "Error loading votes",
    description: "There was an error loading the votes. Try again!",
    secondaryButton: {
      label: "Reload votes",
      iconLeft: IconType.RELOAD,
      // onClick: () => refetch(),
    },
  };

  return (
    <DataList.Root
      entityLabel={entityLabel}
      itemsCount={totalVotes}
      pageSize={DEFAULT_PAGE_SIZE}
      state={undefined}
      onLoadMore={() => {}}
    >
      <DataList.Container
        SkeletonElement={VotesDataListItemSkeleton}
        errorState={errorState}
        emptyState={emptyState}
        emptyFilteredState={emptyFilteredState}
      >
        {votes?.map(({ variant, ...otherProps }, id) => (
          <VotesDataListItemStructure
            {...otherProps}
            variant={variant}
            connectedAccount={address && isAddressEqual(address, otherProps.address)}
            key={id}
          />
        ))}
      </DataList.Container>
      {showPagination && <DataList.Pagination />}
    </DataList.Root>
  );
};
