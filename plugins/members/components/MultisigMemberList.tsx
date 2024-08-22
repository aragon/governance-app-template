import { useState } from "react";
import { DataList, IconType, IllustrationHuman } from "@aragon/ods";
import { MultisigMemberListItem } from "./MultisigMemberListItem";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useMultisigMembers } from "../hooks/useMultisigMembers";
import { PUB_CHAIN } from "@/constants";

export const MultisigMemberList: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>();
  const { members, isLoading } = useMultisigMembers();

  if (isLoading && !members?.length) {
    return <PleaseWaitSpinner fullMessage="Please wait, loading members" />;
  } else if (!members?.length) {
    return <NoMembersView />;
  }

  const filteredMembers = (members || []).filter((item) => {
    if (!searchValue?.trim()) return true;
    return item.toLowerCase().includes(searchValue.toLowerCase());
  });

  const totalMembers = filteredMembers.length || 0;
  const showPagination = false;

  if (!totalMembers) {
    return (
      <DataList.Root entityLabel="No members" itemsCount={0}>
        <DataList.Filter
          onSearchValueChange={setSearchValue}
          searchValue={searchValue}
          placeholder="Filter by address"
        />
        <NoMembersView filtered={!!searchValue?.trim()} />
      </DataList.Root>
    );
  }

  return (
    <DataList.Root entityLabel={totalMembers === 1 ? "member" : "members"} itemsCount={totalMembers}>
      <DataList.Filter onSearchValueChange={setSearchValue} searchValue={searchValue} placeholder="Filter by address" />
      <DataList.Container className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-5">
        {filteredMembers.map((member) => (
          <MultisigMemberListItem
            key={member}
            href={`${PUB_CHAIN.blockExplorers?.default.url}/address/${member}`}
            target="_blank"
            address={member}
          />
        ))}
      </DataList.Container>
      {showPagination && <DataList.Pagination />}
    </DataList.Root>
  );
};

function NoMembersView({ filtered }: { filtered?: boolean }) {
  let message: string;
  if (filtered) {
    message = "There are no members matching the current filter. Please try entering a different search term.";
  } else {
    message = "There are no multisig members yet. Here you will see the addresses of members who can create proposals.";
  }

  return (
    <div className="w-full">
      <p className="text-md text-neutral-400">{message}</p>
      <IllustrationHuman className="mx-auto mb-10 max-w-72" body="VOTING" expression="CASUAL" hairs="CURLY" />
    </div>
  );
}
