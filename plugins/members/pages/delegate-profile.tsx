import { type Address } from "viem";
import { ProfileAside } from "../components/ProfileAside";
import { DelegationStatement } from "../components/DelegationStatement";
import { HeaderMember } from "../components/HeaderMember";
import { useDelegateAnnounce } from "../hooks/useDelegateAnnounce";
import { formatHexString } from "@/utils/evm";

export const DelegateProfile = ({ address }: { address: Address }) => {
  const { announce, isLoading } = useDelegateAnnounce(address);

  return (
    <div className="flex flex-col items-center">
      <HeaderMember address={address} name={announce?.identifier || formatHexString(address)} bio={announce?.bio} />
      <div className="flex w-full max-w-screen-xl flex-col gap-x-12 gap-y-12 px-4 py-6 md:flex-row md:px-16 md:pb-20">
        {/* Main section */}
        <div className="flex flex-col gap-y-12 md:w-[63%] md:gap-y-20">
          {/* Delegation Statement */}
          <div className="flex w-full flex-col gap-y-6 overflow-auto">
            <DelegationStatement message={announce?.message} />
          </div>
        </div>
        {/* Aside */}
        <aside className="flex w-full flex-1 flex-col gap-y-12 md:max-w-[33%] md:gap-y-6">
          <ProfileAside address={address} resources={announce?.resources} />
        </aside>
      </div>
    </div>
  );
};
