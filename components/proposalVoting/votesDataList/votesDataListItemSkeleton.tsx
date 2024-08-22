import { DataListItem, StateSkeletonBar, StateSkeletonCircular } from "@aragon/ods";

export const VotesDataListItemSkeleton: React.FC = () => {
  return (
    <DataListItem className="flex flex-col gap-y-3 py-3 md:py-4">
      <div className="flex w-full items-center gap-x-3 md:gap-x-4">
        <StateSkeletonCircular size="sm" responsiveSize={{ md: "md" }} />
        <div className="flex flex-1 flex-col gap-y-1 md:gap-y-1.5">
          <StateSkeletonBar width="100%" size="md" responsiveSize={{ md: "lg" }} />
          <StateSkeletonBar width="40%" size="md" responsiveSize={{ md: "lg" }} />
        </div>
        <div className="flex flex-1 justify-end">
          <StateSkeletonBar width="35%" size="md" responsiveSize={{ md: "lg" }} />
        </div>
      </div>
    </DataListItem>
  );
};
